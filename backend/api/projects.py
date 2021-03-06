"""Main Module of knex
Defines API points and starts the application
"""

import json
import json5
from uuid import UUID


from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, current_user

from api.helper import uploader
from api.helper.apiexception import ApiException
from api.helper.permissions import current_user_has_permission_to_change_project
from api.notifications import add_notification, add_self_action
from globals import ADMIN_PERMISSION

from storage.projects import delete_stored_project, add_project_list, update_stored_project
from storage.projects import archive_stored_project, project_exists, get_stored_project
from storage.projects import get_stored_projects


projects = Blueprint('api_projects', __name__)


@projects.route('/api/projects', methods=['POST'])
@login_required
def add_projects():
    """Receive manifest as a jsonstring and return new ID
    """
    uploaded_files = request.files.getlist('file[]')
    if len(uploaded_files) is not 0:
        try:
            manifestlist = []
            for file in uploaded_files:
                if file.filename.endswith('.json'):
                    manifestlist.append(json.loads(file.read().decode('utf-8')))
                elif file.filename.endswith('.json5'):
                    manifestlist.append(json5.loads(file.read().decode('utf-8')))
            return jsonify(add_project_list(manifestlist))
        except Exception as err:
            raise ApiException(str(err), 400)
    else:
        try:
            manifestlist = []
            if ('application/json' in request.content_type) and\
                    ('application/json5' not in request.content_type):
                manifestlist = request.get_json()
            elif 'application/json5' in request.content_type:
                manifestlist = json5.loads(request.data.decode('utf-8'))
            else:
                raise ApiException("Wrong content header" +
                                   "and no files attached", 400)
            return jsonify(add_project_list(manifestlist))
        except ApiException as apierr:
            raise apierr

        except UnicodeDecodeError:
            raise ApiException("Only utf-8 compatible charsets are " +
                               "supported, the request body does not " +
                               "appear to be utf-8.", 400)
        except Exception as err:
            raise ApiException(str(err), 400)


@projects.route('/api/projects', methods=['GET'])
@login_required
def get_projects():
    """Return list of projects, args->limit, skip, archived
    Returns:
        res: A list of projects
    """

    archived = request.args.get('archived', type=str, default='false')
    if archived not in ['true', 'false', 'mixed']:
        return make_response('Invalid parameters', 400)
    query = {}
    if archived == 'true':
        query = {'archived': 'true'}
    elif archived == 'false':
        query = {'archived': 'false'}
    res = get_stored_projects(query)
    return jsonify(res)


@projects.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    """Returns project by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project corresponding to the ID
    """

    if not project_exists(project_id):
        return make_response("Project not found", 404)
    try:
        res = get_stored_project(project_id)
        res['is_bookmark'] = 'true' if project_id in current_user['bookmarks'] else 'false'
    except KeyError as err:
        raise ApiException(str(err), 500)
    return jsonify(res)


@projects.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
@login_required
@ADMIN_PERMISSION.require()
def delete_project(project_id):
    """Deletes a project by ID.

    Args:
        project_id: ID of a project

    Returns:
        response: Success response or 404 if project is not found
    """
    if not project_exists(project_id):
        return make_response("Project could not be found", 404)
    delete_stored_project(project_id)
    return make_response("Success")


@projects.route('/api/projects/<uuid:project_id>/archive', methods=['PUT'])
@login_required
def archive_project(project_id):
    try:
        if not project_exists(project_id):
            raise ApiException("Project not found", 404)
        elif not current_user_has_permission_to_change_project(project_id):
            raise ApiException("You are not allowed to edit this project", 403)
        req = request.get_json() if request.is_json \
            else json5.loads(request.data.decode("utf-8"))
        if not req['archived'] or req['archived'] not in ['true', 'false']:
            raise ApiException("No valid field for archivation request found", 400)

        archive_stored_project(project_id, req)
        return make_response("Success")

    except ApiException as error:
        raise error
    except UnicodeDecodeError:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>', methods=['PUT'])
@login_required
def update_project(project_id):
    """Updates Project by ID

    Args:
        project_id, updated manifest in json/json5 format

    Returns:
        response: Success response
                  or 400 in case of validation error
                  or 403 if current user not permitted
                  or 404 if project is not found
    """
    try:
        if not project_exists(project_id):
            raise ApiException("Project not found", 404)
        elif not current_user_has_permission_to_change_project(project_id):
            raise ApiException("You are not allowed to edit this project", 403)
        elif request.is_json or "application/json5" in request.content_type:
            manifest = request.get_json() if request.is_json \
                else json5.loads(request.data.decode("utf-8"))
            if update_stored_project(project_id, manifest):
                return make_response("Success")
            else:
                raise ApiException(
                    "Validation Error: \n" + str(is_valid), 400,
                    [error for error in sorted(g.validator.iter_errors(manifest))])
    except ApiException as error:
        raise error
    except UnicodeDecodeError:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)
