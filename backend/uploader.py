from flask_api import validator, ALLOWED_EXTENSIONS, coll
import elastic
import json5
import time
import uuid
import sys
from apiexception import ApiException

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def save_file_to_db(filename):
    try:
        jsonfile = open(filename)
        if not jsonfile:
            raise ApiException('Could not open '+str(filename), 400)
        if not jsonfile.read():
            raise ApiException('File '+str(filename) + ' is empty.', 400)
        jsonfile.seek(0)
        error = validator.validate_manifest(jsonfile)

        if error == None:
            jsonfile.seek(0)
        
            manifest = json5.load(jsonfile)
            jsonfile.close()
            manifest['date_creation'] = time.strftime("%Y-%m-%d")
            manifest['date_update'] = time.strftime("%Y-%m-%d")
            manifest['id'] = uuid.uuid4()

            elastic.store_json('test', 'projects', manifest)
            coll.insert_one(manifest)
            print("Successfully validated file. ID is " + str(manifest['id']),file=sys.stderr)
            print("File content is: ", file=sys.stderr)
            print(manifest, file=sys.stderr)
            return manifest['id']
        else:
            print(error,file=sys.stderr)
            raise ApiException("Validation Error: \n" + str(error), 400)

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)

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
            return manifest['id']
        else:
            print(error, file=sys.stderr)
            raise ApiException("Validation Error: \n" + str(error), 400)

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException("Error while trying to save the document into db.")
