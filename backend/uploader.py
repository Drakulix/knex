from flask_api import validator, ALLOWED_EXTENSIONS, coll
import elastic
import json5
import time
import uuid
import sys


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file_to_db(filename):
    try:
        jsonfile = open(filename)
        if not jsonfile:
            print("Couldn't open ", filename)
        if not jsonfile.read():
            print("File ", filename, " is empty.")
        jsonfile.seek(0)
        error = validator.validate_manifest(jsonfile)
        jsonfile.seek(0)
    
        manifest = json5.load(jsonfile)
        jsonfile.close()
        manifest['date_creation'] = time.strftime("%Y-%m-%d")
        manifest['date_update'] = time.strftime("%Y-%m-%d")
        manifest['id'] = uuid.uuid4()
    
        if error == None:
            elastic.store_json('test', 'projects', manifest)
            coll.insert_one(manifest)
            print("Successfully validated file. ID is " + str(manifest['id']),file=sys.stderr)
            print("File content is: ", file=sys.stderr)
            print(manifest, file=sys.stderr)
    
        else:
            print(error,file=sys.stderr)
    
        return error
    except Exception as err:
        return Exception("Error while trying to save the document into db.")

def save_manifest_to_db(manifest):
    try:
        manifest['date_creation'] = time.strftime("%Y-%m-%d")
        manifest['date_update'] = time.strftime("%Y-%m-%d")
        manifest['id']=uuid.uuid4()
                
        error = validator.validate_manifest(manifest)
                    
        if error == None:
            coll.insert(manifest)
            elastic.store_json("test", "projects", manifest)
            print("Successfully inserted content: ", file=sys.stderr)
            print(manifest, file=sys.stderr)
        else:
            print(error, file=sys.stderr)

    except Exception as err:
        return Exception("Error while trying to save the document into db.")
