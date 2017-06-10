import sys
import time
import uuid

import json5

from apiexception import ApiException
from flask_api import validator, ALLOWED_EXTENSIONS, coll, es


def allowed_file(filename):
    """Check if the file is an allowed file.

    Args:
        filename: Name of the Upload-File

    Returns:
        bool: True if the file is allowed, False otherwise.
    """
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def save_file_to_db(filename):
    """Save file to the Database.

    Args:
        filename: Name of the Upload-File

    Returns:
        id: The Manifest ID

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
        manifest: The manifest to be saved, may contain multiple json objects

    Returns:
        tuple[0]: The IDs of the manifests successfully stored
        tuple[1]: APIExceptions of manifests that failed to be stored

    Raises:
        ApiException: Error while trying to save the document.
    """
    try:
        is_valid = validator.is_valid(manifest)

        if is_valid:
            manifestlist = manifest if isinstance(manifest, list) else [manifest]
            ids = []
            errors = []
            for entry in manifestlist:
                try:
                    entry['date_creation'] = time.strftime("%Y-%m-%d")
                    entry['date_update'] = time.strftime("%Y-%m-%d")
                    entry['_id'] = uuid.uuid4()
                    print("manifest is valid", file=sys.stderr)
                    coll.insert(entry)
                    print("mongo insert: ", file=sys.stderr)
                    es.create(index="projects-index", doc_type='Project',
                                id=entry["_id"], refresh=True, body={})
                    print("Successfully inserted content: ", file=sys.stderr)
                    print(entry, file=sys.stderr)
                    ids.append(entry['_id'])
                except ApiException as e:
                    errors.append(e)
                except Exception as err:
                    errors.append(ApiException("Manifest " + entry + "failed with the message: " + err.message))
            return (ids, errors)
        else:
            print(is_valid, file=sys.stderr)
            errors = sorted(validator.iter_errors(manifest), key=str)
            validation_error = {}
            validation_error["errors"] = []
            validation_error["sub_errors"] = []
            for error in errors:
                validation_error["errors"].append(error.message)
                print(error.message, file=sys.stderr)
                for suberror in sorted(error.context, key=lambda e: e.schema_path):
                    validation_error["sub_errors"].append(suberror.message)
                    print(list(suberror.schema_path), suberror.message, sep=", ", file=sys.stderr)
            raise ApiException("Validation Error: \n" + str(is_valid), 400, validation_error)

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException("Error while trying to save the document(s) into db." + err.message)
