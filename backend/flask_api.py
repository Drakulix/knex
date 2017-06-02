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

# TODO open this in om startup
with app.open_resource("manifest_schema.json") as schema_file:
    schema = json.load(schema_file)
validator = Draft4Validator(schema, format_checker=FormatChecker())

ALLOWED_EXTENSIONS = {'txt', 'json', 'json5'}
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000  # 100.000 byte = 100kb


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
    except Exception as e:
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



# Search function which gets a text and does a full text search on all attributes
@app.route('/api/projects/search/simple/<int:offset>/<int:count>/', methods=['GET'])
def search_offset_count(offset, count):
    text = request.args.get("q", type=str)
    print(request.args.get("st", type=str),file=sys.stderr)
#^3 is boosting the attribute, *_is allowing wildcards to be used
    request_string = '{"from" : 1, "size" : 1, "query": {"multi_match" : {"query" : "" , "fields" : [ "tags^2", "title^2", "description" ] } } }'
    request_json = json.loads(request_string)
    request_json['query']['multi_match']['query'] = text
    request_json['from'] = offset
    request_json['size'] = count
    print(json.dumps(request_json),file=sys.stderr)
    try:
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
        return jsonify(res['hits']['hits'])
    except RequestError as e:
        return (str(e), 400)


#get projects containing having the search string somewhere within the tag field 
@app.route('/api/projects/search/tag/<int:offset>/<int:count>/', methods=['GET'])
def search_tag(offset, count):
    tag = request.args.get('q', type=str)
    request_string = '{"from" : 1, "size" : 1, "query": {"bool": {"must": [{"match_phrase": {"tags": ""} } ] } } }'
    request_json = json.loads(request_string)
    request_json['query']['bool']['must'][0]['match_phrase']['tags'] = tag
    request_json['from'] = offset
    request_json['size'] = count
    try:
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
        return jsonify(res['hits']['hits'])
    except RequestError as e:
        return (str(e), 400)


@app.route('/api/projects/search/suggest/', methods=['GET'])
def search_title():
    text = request.args.get('q', type=str)
    request_string = '{"suggest": {"text" : "","phraseSuggestion" : {"phrase":{"field" : "description","direct_generator":[{"field": "description","size": 10,"suggest_mode":"missing", "min_word_length": 3,"prefix_length":2}],"highlight": {"pre_tag": "<em>","post_tag": "</em>"} } } }}'
    request_json = json.loads(request_string)
    request_json['suggest']['text'] = text
    try:
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
        return (jsonify(res['suggest']['phraseSuggestion'][0]['options']))
    except RequestError as e:
        return (str(e), 400)

# dummy add a few projects to es
# Also sets up the mappings in elasticsearch which is necessary to do once in order to get suggestion
#Note: deleting these projects will throw not found error bcause they are in es only, but they are deleted
@app.route('/api/projects/dummyadd', methods=['GET'])
def dummyadd():

    settings = '{ "settings" : {"number_of_shards" : 1, "number_of_replicas" : 0}, "mappings" : {"suggest" : {"type" : "completion"},"title" : {"type": "completion"}, "description" : {"type": "string"}}}'
    es.create(index="projects-index",doc_type='Project',id=0,body=settings)

    output = "["

    f = open('jsonprojectexamples/example0.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=1, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example1.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=2, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example2.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=3, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example3.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=4, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example4.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=5, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example5.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=6, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example6.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=7, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example7.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=8, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example8.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=9, body=doc)
    output += json.dumps(res) + " ]"

    return (output)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
