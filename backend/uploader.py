"""Module to upload or save manifests to the databases.
"""

import sys
import time
import uuid
import json5

from apiexception import ApiException
from flask_api import validator, ALLOWED_EXTENSIONS, coll, es  # TODO: Fix cyclic imports


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

                res = es.create(index="projects-index", doc_type='Project',
                                id=manifest['_id'], body=manifest)

                manifest['_id'] = uuid.uuid4()
                coll.insert_one(manifest)

                return manifest['_id']

            else:
                print(is_valid, file=sys.stderr)
                errors = validator.iter_errors(manifest)
                if errors is not None:
                    validation_error = [error for error in sorted(errors, key=str)]
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
        id: The ID of the manifest

    Raises:
        ApiException: Error while trying to save the document.
    """
    try:
        is_valid = validator.is_valid(manifest)

        if is_valid:
            manifestlist = manifest if isinstance(manifest, list) else [manifest]
            ids = []

            for entry in manifestlist:
                entry['date_creation'] = time.strftime("%Y-%m-%d")
                entry['date_update'] = time.strftime("%Y-%m-%d")

                curid = uuid.uuid4()

                es.create(index="projects-index", doc_type='Project',
                          id=curid, refresh=True, body=entry)

                entry['_id'] = curid
                coll.insert(entry)

                ids.append(curid)

            return ids
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
        raise ApiException("Error while trying to save the document(s) into db." + str(err))
