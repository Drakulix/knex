from flask_api import validator, ALLOWED_EXTENSIONS, coll
import elastic
import json5
import time
import uuid

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file_to_db(filename):
    jsonfile = open(filename)
    error = validator.validate_manifest(jsonfile)

    manifest = json5.load(open(filename))
    manifest['date_creation'] = time.strftime("%Y-%m-%d")
    manifest['date_update'] = time.strftime("%Y-%m-%d")
    manifest['id']=uuid.uuid4()

    if error == None:
        elastic.store_json('test', 'projects', manifest)
        coll.insert_one(manifest)
        print("Successfully validated file. ID is"+str(manifest['id']))

    else:
        print(error)

    return error
