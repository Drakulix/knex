import sys
import time
import uuid

import json5

from apiexception import ApiException
from flask_api import validator, ALLOWED_EXTENSIONS, coll, es


def allowed_file(filename):
    """Check if the file is an allowed file.

    Args:
        filename: Filename

    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_file_to_db(filename):
    """Save file to the Database.

    Args:
        filename: Filename

    Returns:
        TYPE: Description

    Raises:
        ApiException: Error while trying to open/save the file or ElasticSearch Index Error.
    """
    try:
        with open(filename) as jsonfile:
            if not jsonfile:
                raise ApiException('Could not open ' + str(filename), 400)
            if not jsonfile.read():
                raise ApiException('File ' + str(filename) + ' is empty.', 400)
            jsonfile.seek(0)
            manifest = json5.load(jsonfile)
            is_valid = validator.is_valid(manifest)

            if is_valid:
                jsonfile.seek(0)
                jsonfile.close()
                manifest['date_creation'] = time.strftime("%Y-%m-%d")
                manifest['date_update'] = time.strftime("%Y-%m-%d")
                manifest['id'] = uuid.uuid4()

                res = es.index(index="projects-index", doc_type='Project',
                               id=manifest['id'], body=manifest)
                if res['created']:
                    coll.insert_one(manifest)

                    print("Successfully validated file. ID is " +
                          str(manifest['id']), file=sys.stderr)
                    print("File content is: ", file=sys.stderr)
                    print(manifest, file=sys.stderr)
                    return manifest['id']
                else:
                    print(is_valid, file=sys.stderr)
                    raise ApiException("ElasticSearch Index Error: \n" + str(is_valid), 500)
            else:
                print(is_valid, file=sys.stderr)
                v = validator.iter_errors(manifest)
                if v is not None:
                    validation_error = []
                    for error in sorted(validator.iter_errors(manifest), key=str):
                        print(error.message, file=sys.stderr)
                        validation_error.append(error.message)
                raise ApiException("Validation Error: \n" + str(is_valid), 400)

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)


def save_manifest_to_db(manifest):
    """Save manifest to the Database.

    Args:
        manifest: Description

    Returns:
        TYPE: Description

    Raises:
        ApiException: Error while trying to save the document.
    """
    try:
        manifest['date_creation'] = time.strftime("%Y-%m-%d")
        manifest['date_update'] = time.strftime("%Y-%m-%d")
        manifest['_id'] = uuid.uuid4()

        is_valid = validator.is_valid(manifest)

        if is_valid:
            print("manifest is valid", file=sys.stderr)
            coll.insert(manifest)
            print("mongo insert: ", file=sys.stderr)
            es.create(index="projects-index", doc_type='Project',
                      id=manifest["_id"], refresh=True, body={})
            print("Successfully inserted content: ", file=sys.stderr)
            print(manifest, file=sys.stderr)
            return manifest['_id']
        else:
            print(is_valid, file=sys.stderr)
            validation_error = []
            for error in sorted(validator.iter_errors(manifest), key=str):
                print(error.message, file=sys.stderr)
                validation_error.append(error.message)
            raise ApiException("Validation Error: \n" + str(is_valid), 400, validation_error)

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException("Error while trying to save the document into db." + err.message)
