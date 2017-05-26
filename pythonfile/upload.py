import os
from flask.helpers import flash
from flask import Flask, request, redirect, url_for, render_template
from werkzeug.utils import secure_filename
from manifest_validator import ManifestValidator
from flask_api import app
from flask import Request


UPLOAD_FOLDER = '/usr/uploads'
ALLOWED_EXTENSIONS = set(['txt', 'json'])
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_PATH'] = 100000; #10.000 byte = 10kb 


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route('/upload')
def upload_file():
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
            return redirect(url_for('uploaded_file', filename=filename))
    return '''
    <!doctype html>
    <title>Error</title>
    <h1>Please visit flask:5000/upload to upload files.</h1>
    </html>
    '''
