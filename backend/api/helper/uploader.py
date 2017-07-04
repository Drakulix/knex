"""Module to upload or save manifests to the databases.
"""

import sys
import time
import uuid
import json5

from flask import g
from api.helper.apiexception import ApiException


def save_manifest_to_db(manifest):
    """Save manifest to the Database.

    Args:
        manifest: The manifest to be saved, may contain multiple json objects

    Returns:
        id: The ID of the manifest

    Raises:
        ApiException: Error while trying to save the documents.
    """
    try:
        manifestlist = manifest if isinstance(manifest, list) else [manifest]
        for entry in manifestlist:
            if not entry['date_creation']:
                entry['date_creation'] = time.strftime("%Y-%m-%d")

        is_valid = g.validator.is_valid(manifestlist)

        if is_valid:
            ids = []

            for entry in manifestlist:
                entry['date_last_updated'] = time.strftime("%Y-%m-%d")
                entry['_id'] = uuid.uuid4()
                g.projects.insert(entry)

                ids.append(entry['_id'])

            return ids
        else:
            print(is_valid, file=sys.stderr)
            errors = sorted(g.validator.iter_errors(manifest), key=str)
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
