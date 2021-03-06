"""Module to upload or save manifests to the databases.
"""

import time
import uuid

from flask import g
from api.helper.apiexception import ApiException


def save_manifest_to_db(manifest):
    """Save manifest to the Database.

    Args:
        manifest: The manifest to be saved, may contain multiple json objects

    Returns:
        projects: The project in the manifests

    Raises:
        ApiException: Error while trying to save the documents.
    """
    try:
        manifestlist = manifest if isinstance(manifest, list) else [manifest]
        for entry in manifestlist:
            if 'date_creation' not in entry:
                entry['date_creation'] = time.strftime("%Y-%m-%d")

        is_valid = g.validator.is_valid(manifestlist)
        if is_valid:
            projects = []
            for entry in manifestlist:
                entry['date_last_updated'] = time.strftime("%Y-%m-%d")
                entry['_id'] = uuid.uuid4()
                if 'archived' not in manifest:
                    entry['archived'] = "false"
                entry['authors'] = sorted(list(set(entry['authors'])))
                entry['tags'] = sorted(entry['tags'])
                projects.append(entry)

            return projects
        else:
            errors = sorted(g.validator.iter_errors(manifest), key=str)
            validation_error = {}
            validation_error["errors"] = []
            validation_error["sub_errors"] = []
            for error in errors:
                validation_error["errors"].append(error.message)
                for suberror in sorted(error.context, key=lambda e: e.schema_path):
                    validation_error["sub_errors"].append(suberror.message)
            raise ApiException("Validation Error: \n" + str(is_valid), 400,
                               validation_error)

    except ApiException as apie:
        raise apie
    except Exception as err:
        raise ApiException(
            "Error while trying to save the document(s) into db." + str(err))
