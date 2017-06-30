"""Main Module of knex
Defines API points and starts the application
"""

import sys
import time
import json
import json5

from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, roles_required
from pymongo.collection import ReturnDocument
from werkzeug.utils import secure_filename

from api.helper import uploader
from api.helper.apiexception import ApiException
from globals import ADMIN_PERMISSION


projects = Blueprint('api_projects', __name__)


@projects.route('/api/projects', methods=['POST'])
@login_required
def add_projects():
    """Receive manifest as a jsonstring and return new ID
    """
    successful_ids = []
    unsuccessful_files = []
    uploaded_files = request.files.getlist('file[]')
    if len(uploaded_files) is not 0:
        for file in uploaded_files:
            securefilename = secure_filename(file.filename)
            if file and uploader.allowed_file(securefilename):
                try:
                    newid = uploader.save_file_to_db(file, securefilename)
                    ids.append(newid)
                except ApiException as e:
                    unsuccessful_files.append(file.filename + str(e))

        return jsonify(successful_ids)

    else:
        try:
            return_ids = []
            if ('application/json' in request.content_type) and \
                    ('application/json5' not in request.content_type):
                return_ids = uploader.save_manifest_to_db(request.get_json())
            elif 'application/json5' in request.content_type:
                return_ids = uploader.save_manifest_to_db(
                    json5.loads(request.data.decode('utf-8')))
            else:
                raise ApiException("Wrong content header" +
                                   "and no files attached", 400)
            return jsonify(return_ids)

        except ApiException as e:
            raise e

        except UnicodeDecodeError as ue:
            raise ApiException("Only utf-8 compatible charsets are " +
                               "supported, the request body does not " +
                               "appear to be utf-8.", 400)
        except Exception as err:
            raise ApiException(str(err), 400)


@projects.route('/api/projects', methods=['GET'])
def get_projects():
    """Return list of projects, args->limit, skip

    Returns:
        res: A list of projects
    """
    limit = request.args.get('limit', type=int)
    skip = request.args.get('skip', type=int)
    argc = len(request.args)

    if g.projects.count() == 0:
        return make_response(jsonify([]), 200)

    if argc == 0:
        res = g.projects.find({})
    elif limit and skip and argc < 3:
        res = g.projects.find({}, limit=limit, skip=skip)
    elif limit and argc < 2:
        res = g.projects.find({}, limit=limit)
    elif skip and argc < 2:
        res = g.projects.find({}, skip=skip)
    else:
        return make_response('Invalid parameters', 400)

    res = make_response(jsonify([x for x in res[:]]))
    res.headers['Content-Type'] = 'application/json'
    return res


@projects.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    """Returns project by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project corresponding to the ID
    """
    res = g.projects.find_one({'_id': project_id})
    if res is None:
        return make_response("Project not found", 404)
    return jsonify(res)


@projects.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
@login_required
@roles_required('admin')
def delete_project(project_id):
    """Deletes a project by ID.

    Args:
        project_id: ID of a project

    Returns:
        response: Success response or 404 if project is not found
    """
    if g.projects.delete_one({'_id': project_id}).deleted_count == 0:
        return make_response("Project could not be found", 404)
    else:
        return make_response("Success")


@projects.route('/api/projects/<uuid:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    """Updates Project by ID

    Args:
        project_id, updated manifest in json/json5 format

    Returns:
        response: Success response
                  or 400 in case of validation error
                  or 404 if project is not found
                  or 409 if project_id differs from manifestID
    """
    try:
        res = g.projects.find_one({'_id': project_id})
        if res is None:
            raise ApiException("Project not found", 404)
        elif request.is_json or "application/json5" in request.content_type:
            if request.is_json:
                manifest = request.get_json()
                if manifest['_id'] != str(project_id):
                    raise ApiException("Updated project owns different id",
                                       409)
            else:
                manifest = json5.loads(request.data.decode("utf-8"))
                if '_id' in manifest:
                    if manifest['_id'] != str(project_id):
                        raise ApiException("Updated project owns different id",
                                           409)
            is_valid = g.validator.is_valid(manifest)
            if is_valid:
                print("manifest validated", file=sys.stderr)
                manifest['_id'] = project_id
                manifest['date_last_updated'] = time.strftime("%Y-%m-%d")
                g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                return_document=ReturnDocument.AFTER)
                print("mongo replaced:", file=sys.stderr)
                print(manifest, file=sys.stderr)
                return make_response("Success")
            elif request.on_json_loading_failed() is not None:
                raise ApiException("json could not be parsed",
                                   400, request.on_json_loading_failed())
            else:
                validation_errs = [error for error in
                                   sorted(g.validator.iter_errors(manifest))]
                if validation_errs is not None:
                    raise ApiException("Validation Error: \n" +
                                       str(is_valid), 400, validation_errs)
        else:
            raise ApiException("Manifest had wrong format", 400)
    except ApiException as error:
        raise error
    except UnicodeDecodeError as unicodeerr:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)
