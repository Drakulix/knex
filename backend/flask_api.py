import os
import sys
from werkzeug.utils import redirect
from flask.helpers import flash
from flask_cors import CORS
from flask import Flask, request, jsonify, make_response, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from manifest_validator import ManifestValidator
import time, json5, uuid, json
import elastic
from elasticsearch import Elasticsearch
from bson.json_util import dumps


client=MongoClient('mongodb:27017')
db=client.knexDB
coll=db.projects

schema = open("manifest_schema.json")
validator = ManifestValidator(schema)

es = Elasticsearch(['http://elasticsearch:9200'])
app=Flask(__name__)
CORS(app)

ALLOWED_EXTENSIONS = set(['txt', 'json', 'json5'])
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000; #100.000 byte = 100kb 


@app.route('/', methods=['GET'])
def index():
    return make_response('', 404)

# receive manifest as a jsonstring
# returns new id
@app.route('/api/projects', methods=['GET', 'POST'])
def add_project():
    if request.method == 'POST':
        successful_files = []
        unsuccessful_files = []
        uploaded_files = request.files.getlist("file[]")
        if len(uploaded_files) is not 0:
            for file in uploaded_files:
                securefilename = secure_filename(file.filename)
                if file and uploader.allowed_file(securefilename):
                    file.save(os.path.join(app.config['UPLOAD_FOLDER'], securefilename))
                    err = uploader.save_file_to_db(securefilename)
                    if (err == None):
                        successful_files.append(file.filename) #represent original filename
                    else:
                        unsuccessful_files.append(file.filename)
                    print("Successful files: ", successful_files, '\n', file=sys.stderr)
                    print("Unsuccessful files: ", unsuccessful_files, '\n', file=sys.stderr)
            return      """<!doctype html>
                        <title>Upload multiple files</title>
                        <h1>Upload multiple files</h1>
                        <body>Successful files: """ + ', '.join( e for e in successful_files) + '<br />' + """
                        Unsuccessful files: """ + ', '.join( e for e in unsuccessful_files) + """
                        </body>"""

        else: #no files attached
            try:
                err = None
                if request.json:
                    err = uploader.save_manifest_to_db(request.json)
                else:
                    err = uploader.save_manifest_to_db(json5.load(request.data))

                if err == None:
                    return make_response("Successfully saved json to DB.")
                else:
                    return make_response("Exception while trying to save the json to DB.")
            except Exception as error:
                return make_response("error", '500')


    elif request.method == 'GET': #remove this later, default multi file uploader for testing purposes
        return """
    <!doctype html>
    <title>Upload multiple files</title>
    <h1>Upload multiple files</h1>
    <form action="" method=post enctype=multipart/form-data>
    <input type=file name="file[]" multiple>
    <input type=submit value=Upload>
    </form>"""

# return list of projects, args->limit, skip
@app.route('/api/projects', methods=['GET'])
def get_projects():
    limit=request.args.get('limit', type=int)
    skip=request.args.get('skip', type=int)
    
    argc=len(request.args)

    if coll.projects.count() == 0:
        return make_response('There are no projects', 500)

    if argc==0:
        res=coll.find({})
    elif limit and skip and argc<3:
        res=coll.find({}, limit=limit, skip=skip)
    elif limit and argc<2:
        res=coll.find({}, limit=limit)
    elif skip and argc<2:
        res=coll.find({}, skip=skip)
    else:
        return make_response('Invalid parameters',400)

    res=make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json' 

    return res

@app.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    res=coll.find_one({'_id': project_id})
    if res is None:
      return make_response('Project not found', 404)
    return jsonify(res)

@app.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
def delete_project(project_id):
    if coll.delete_one({'_id':project_id}).deleted_count != 0:
        return make_response('Success')
    else:
        return make_response('Project not found', 404)

# receive body of elasticsearch query
@app.route('/api/projects/search', methods=['POST'])
def search():
    res=es.search(index="test", doc_type="projects", body=request.json)
    return jsonify(res)

@app.route('/upload')
def upload():
    return render_template('upload.html')

@app.route('/api/projects/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)
        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)
        securefilename = secure_filename(file.filename)
        if file and uploader.allowed_file(securefilename):
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], securefilename))
            if (uploader.save_file_to_db(securefilename) == None):
                return render_template('upload_success.html')
            else:
                return render_template('upload_error.html')


@app.route("/uploads", methods=["GET", "POST"])
def uploads():
    if request.method == 'POST':
        successful_files = []
        unsuccessful_files = []
        uploaded_files = request.files.getlist("file[]")
        for file in uploaded_files:
            securefilename = secure_filename(file.filename)
            if file and uploader.allowed_file(securefilename):
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], securefilename))
                err = uploader.save_file_to_db(securefilename)
                if (err == None):
                    successful_files.append(file.filename) #represent original filename
                else:
                    unsuccessful_files.append(file.filename)
                print("Successful files: ", successful_files, '\n', file=sys.stderr)
                print("Unsuccessful files: ", unsuccessful_files, '\n', file=sys.stderr)
        return """<!doctype html>
    <title>Upload multiple files</title>
    <h1>Upload multiple files</h1>
    <body>Successful files: """ + ', '.join( e for e in successful_files) + """
    Unsuccessful files: """ + ', '.join( e for e in unsuccessful_files) + '\n' + """
    </body>
    """
    
    elif request.method == 'GET':
        return """
    <!doctype html>
    <title>Upload multiple files</title>
    <h1>Upload multiple files</h1>
    <form action="" method=post enctype=multipart/form-data>
    <input type=file name="file[]" multiple>
    <input type=submit value=Upload>
    </form>"""

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
