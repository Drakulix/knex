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
        if file and uploader.allowed_file(file.filename):
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if (uploader.save_file_to_db(filename) == None):
                return render_template('upload_success.html')
            else:
                return render_template('upload_error.html')


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
