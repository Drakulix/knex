import os
from flask.helpers import flash
from flask import request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from flask_api import app, validator
from flask import Request
import elastic
import json5


UPLOAD_FOLDER = '/usr/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'json'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_PATH'] = 1000000; #100.000 byte = 100kb 


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file_to_db(filename):
    error = validator.validate_manifest(open(filename))

    manifest = json5.load(open(filename))
    manifest['date_creation'] = time.strftime("%Y-%m-%d")
    manifest['date_update'] = time.strftime("%Y-%m-%d")
    manifest['id']=uuid.uuid4()

    if error == None:
        elastic.store_json('test', 'projects', manifest)

    return error

@app.route('/upload')
def upload():
   return render_template('templates/upload.html')


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
        if file and allowed_file(file.filename) and file.size < app.config['MAX_CONTENT_PATH']:
            filename = secure_filename(file.filename)
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            if (save_file_to_db(filename) == None):
                return render_template('templates/upload_success.html')
            else:
                return render_template('templates/upload_error.html')
