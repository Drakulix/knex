import os
from werkzeug.utils import redirect
from flask.helpers import flash
from flask import Flask, request, jsonify, make_response, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from pymongo import MongoClient
from manifest_validator import ManifestValidator
import time, json5, uuid, json
import elastic
from elasticsearch import Elasticsearch
import uploader


client=MongoClient('mongodb:27017')
db=client.knexDBmh1
coll=db.projects

schema = open("manifest_schema.json")
validator = ManifestValidator(schema)

app=Flask(__name__)

ALLOWED_EXTENSIONS = set(['txt', 'json'])
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000; #100.000 byte = 100kb 


@app.route('/', methods=['GET'])
def index():
    return make_response('', 404)

# receive manifest as a jsonstring
# returns new id
@app.route('/api/projects', methods=['POST'])
def add_project():
    manifest=request.json
    manifest['date_creation'] = time.strftime("%Y-%m-%d")
    manifest['date_update'] = time.strftime("%Y-%m-%d")

    error = validator.validate_manifest(manifest)

    if error == None:
        manifest['id']=uuid.uuid4()
        coll.insert(manifest)
        elastic.store_json("test", "projects", manifest)
        return make_response(manifest['id'])
    else:
        return make_response((error, '302'))

@app.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    res=coll.find_one({'_id':project_id})
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
    res=elastic.es.search(index="test", doc_type="projects", body=request.json)
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
                if (uploader.save_file_to_db(securefilename) == None):
                    successful_files.append(file.filename) #represent original filename
                else:
                    unsuccessful_files.append(file.filename)
        return make_response(successful_files, unsuccessful_files) #FIXME: build correct response showing successful and unsuccessful files
    
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
