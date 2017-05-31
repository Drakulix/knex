import json
import os
import sys

import json5
from bson.json_util import dumps
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import RequestError
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient
from werkzeug.utils import secure_filename

import uploader
from apiexception import ApiException

es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200}])

client = MongoClient('mongodb:27017')
db = client.knexDB
coll = db.projects

with open("manifest_schema.json") as schema_file:
    schema = json.load(schema_file)
validator = Draft4Validator(schema, format_checker=FormatChecker())

app = Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = set(['txt', 'json', 'json5'])
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000;  # 100.000 byte = 100kb


@app.route('/', methods=['GET'])
def index():
    return make_response('', 404)


# receive manifest as a jsonstring
# returns new id
@app.route('/api/projects', methods=['POST'])
def add_project():
    successful_files = []
    unsuccessful_files = []
    uploaded_files = request.files.getlist("file[]")
    if len(uploaded_files) is not 0:
        for file in uploaded_files:
            securefilename = secure_filename(file.filename)
            if file and uploader.allowed_file(securefilename):
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], securefilename))
                try:
                    newId = uploader.save_file_to_db(securefilename)
                    successful_files.append(file.filename + " " + str(newId))  # represent original filename
                except Exception as e:
                    unsuccessful_files.append(file.filename + str(e))

                print("Successful files: ", successful_files, '\n', file=sys.stderr)
                print("Unsuccessful files: ", unsuccessful_files, '\n', file=sys.stderr)
        return """<!doctype html>
                    <title>Upload multiple files</title>
                    <h1>Upload multiple files</h1>
                    <body>Successful files: """ + ', '.join(e for e in successful_files) + '<br />' + """
                    Unsuccessful files: """ + ', '.join(e for e in unsuccessful_files) + """
                    </body>"""

    else:  # no files attached
        try:
            newid = None
            if request.json:
                newid = uploader.save_manifest_to_db(request.json)
            else:
                print(request.data.decode("utf-8"), file=sys.stderr)
                newid = uploader.save_manifest_to_db(json5.loads(request.data.decode("utf-8")))

            return make_response(str(newid))
        except ApiException as e:
            raise e
        except Exception as err:
            return make_response("error: " + str(err), '500')


@app.errorhandler(ApiException)
def handle_invalid_usage(error):
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.route('/upload', methods=['GET'])
def uploads():
    if request.method == 'GET':  # remove this later, default multi file uploader for testing purposes
        return """<!doctype html>
    <title>Upload multiple files</title>
    <h1>Upload multiple files</h1>
    <form action="" method=post enctype=multipart/form-data>
    <input type=file name="file[]" multiple>
    <input type=submit value=Upload>
    </form>"""


# return list of projects, args->limit, skip
@app.route('/api/projects', methods=['GET'])
def get_projects():
    limit = request.args.get('limit', type=int)
    skip = request.args.get('skip', type=int)

    argc = len(request.args)

    if coll.count() == 0:
        return make_response('There are no projects', 500)

    if argc == 0:
        res = coll.find({})
    elif limit and skip and argc < 3:
        res = coll.find({}, limit=limit, skip=skip)
    elif limit and argc < 2:
        res = coll.find({}, limit=limit)
    elif skip and argc < 2:
        res = coll.find({}, skip=skip)
    else:
        return make_response('Invalid parameters', 400)

    res = make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json'

    return res


@app.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    res = coll.find_one({'_id': project_id})
    if res is None:
        return make_response('Project not found', 404)
    return jsonify(res)


@app.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
def delete_project(project_id):
    try:
        es.delete(index="projects-index", doc_type='Project', id=project_id, refresh=True)
    except NotFoundError:
        if coll.delete_one({'_id': project_id}).deleted_count == 0:
            return make_response('Project not found', 404)
        else:
            return make_response('Success')
    else:
        coll.delete_one({'_id': project_id})
        return make_response('Success')


# receive body of elasticsearch query
@app.route('/api/projects/search', methods=['POST'])
def search():
    try:
        res = es.search(index="projects-index", doc_type="Project", body=request.json)
        return jsonify(res)
    except RequestError as e:
        return (str(e), 400)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
