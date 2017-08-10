"""Main Module of knex
Defines API points and starts the application
"""

import time
import uuid
import json
import json5

from flask import request, jsonify, make_response, g, Blueprint
from pymongo.collection import ReturnDocument
from flask_security import login_required, current_user

from api.helper import uploader
from api.helper.apiexception import ApiException
from api.helper.permissions import current_user_has_permission_to_change
from api.notifications import add_notification, add_self_action
from globals import ADMIN_PERMISSION


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
            projects = uploader.save_manifest_to_db(manifestlist)
            for project in projects:
                if 'comments' not in project:
                    project['comments'] = []
                g.projects.insert(project)
                add_notification(current_user['email'], project['authors'], "create",
                                 project_id=project['_id'], reason='author')
                add_self_action(current_user['email'], "create", project_id=project['_id'])
                g.rerun_saved_searches(current_user['email'], project['_id'], "create")
            return jsonify([project['_id'] for project in projects])
        except Exception as err:
            raise ApiException(str(err), 400)

    else:
        try:
            projects = []
            if ('application/json' in request.content_type) and\
                    ('application/json5' not in request.content_type):
                projects = uploader.save_manifest_to_db(request.get_json())
            elif 'application/json5' in request.content_type:
                projects = uploader.save_manifest_to_db(
                    json5.loads(request.data.decode('utf-8')))
            else:
                raise ApiException("Wrong content header" +
                                   "and no files attached", 400)
            for project in projects:
                if 'comments' not in project:
                    project['comments'] = []
                g.projects.insert(project)
                add_notification(current_user['email'], project['authors'], "create",
                                 project_id=project['_id'], reason='author')
                add_self_action(current_user['email'], "create", project_id=project['_id'])
                g.rerun_saved_searches(current_user['email'], project['_id'], "create")
            return jsonify([project['_id'] for project in projects])

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
    limit = request.args.get('limit', type=int)
    skip = request.args.get('skip', type=int)
    archived = request.args.get('archived', type=str, default='false')
    if archived not in ['true', 'false', 'mixed']:
        return make_response('Invalid parameters', 400)

    if g.projects.count() == 0:
        return make_response(jsonify([]), 200)
    query = {}
    if archived == 'true':
        query = {'archived': True}
    elif archived == 'false':
        query = {'archived': False}
    if limit and skip:
        res = g.projects.find(query, {'comments': 0}, limit=limit, skip=skip)
    elif limit:
        res = g.projects.find(query, {'comments': 0}, limit=limit)
    elif skip:
        res = g.projects.find(query, {'comments': 0}, skip=skip)
    else:
        res = g.projects.find(query)

    try:
        res = [x for x in res[:]]
        for project in res:
            project['is_bookmark'] = 'true' if project['_id']\
                in current_user['bookmarks'] else 'false'
            project['is_owner'] = 'true' if current_user['email']\
                in project['authors'] else 'false'
        return jsonify(res)
    except KeyError as err:
        raise ApiException(str(err), 400)


@projects.route('/api/projects/authors', methods=['GET'])
@login_required
def get_all_authors():
    """ Returns a list of all email adresses used in projects "authors" field.
    """
    try:
        authors = g.projects.distinct('authors')
        all_authors = sorted(authors, key=lambda k: str(k).lower()) if authors else []
        return jsonify(all_authors)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/tags', methods=['GET'])
@login_required
def get_all_tags():
    """ Returns a list of all tags used in projects "tags" field.
    """
    try:
        tags = g.projects.distinct('tags')
        return jsonify(sorted(tags, key=str.lower))
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/titles', methods=['POST'])
@login_required
def getProjectTitles():
    """ Returns a dictionary of each project in the database as key and
        its title as value.
    """
    projects = [uuid.UUID(project_id) for project_id in set(request.get_json())]
    projectlist = g.projects.find({'_id': {'$in': projects}}, {"_id": 1, "title": 1})
    return jsonify(dict([(str(project['_id']), project['title']) for project in projectlist]))


@projects.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    """Returns project by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project corresponding to the ID
    """
    archived = request.args.get('archived', type=str, default="mixed")
    if archived == 'true':
        res = g.projects.find_one({'_id': project_id, 'archived': True}, {'comments': 0})
    elif archived == 'false':
        res = g.projects.find_one({'_id': project_id, 'archived': False}, {'comments': 0})
    elif archived == 'mixed':
        res = g.projects.find_one({'_id': project_id}, {'comments': 0})
    else:
        return make_response('Invalid parameters', 400)
    if res is None:
        return make_response("Project not found", 404)
    try:
        res['is_bookmark'] = 'true' if project_id in current_user['bookmarks'] else 'false'
        res['is_owner'] = 'true' if current_user['email'] in res['authors'] else 'false'
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
    if g.projects.delete_one({'_id': project_id}).deleted_count == 0:
        return make_response("Project could not be found", 404)
    g.rerun_saved_searches(current_user['email'], project_id, "delete")
    g.on_project_deletion(project_id)
    return make_response("Success")


@projects.route('/api/projects/<uuid:project_id>/archive', methods=['PUT'])
@login_required
def archive_project(project_id):
    try:
        res = g.projects.find_one({'_id': project_id})
        if not res:
            raise ApiException("Project not found", 404)
        state = request.get_json() if request.is_json \
            else json5.loads(request.data.decode("utf-8"))
        if not state['archived'] or state['archived'] not in ['true', 'false']:
            raise ApiException("No valid field for archivation state found", 400)
        if current_user_has_permission_to_change(res):
            res['archived'] = "true" if state['archived'] == 'true' else "false"
            g.projects.find_one_and_replace({'_id': project_id}, res,
                                            return_document=ReturnDocument.AFTER)
            res['date_last_updated'] = time.strftime("%Y-%m-%d")
            res['_id'] = project_id
            g.projects.find_one_and_replace({'_id': project_id}, res,
                                            return_document=ReturnDocument.AFTER)
            add_notification(current_user['email'], res['authors'], "archive",
                             project_id=project_id, reason='author')
            add_notification(current_user['email'], g.users_with_bookmark(project_id), "archive",
                             project_id=project_id, reason='bookmark')
            add_notification(current_user['email'],
                             [comment['author'] for comment in res['comments']], "archive",
                             project_id=project_id, reason='comment')
            add_self_action(current_user['email'], "archive", project_id=project_id)
            g.rerun_saved_searches(current_user['email'], project_id, "archive")

            return make_response("Success")
        elif not current_user_has_permission_to_change(manifest):
            raise ApiException("You are not allowed to edit this project", 403)

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
                  or 409 if project_id differs from manifestID
    """
    try:
        res = g.projects.find_one({'_id': project_id})
        if not res:
            raise ApiException("Project not found", 404)
        elif request.is_json or "application/json5" in request.content_type:
            manifest = request.get_json() if request.is_json \
                else json5.loads(request.data.decode("utf-8"))

            if 'title' in manifest:
                res['title'] = manifest['title']
            if 'authors' in manifest:
                res['authors'] = manifest['authors']
            if 'tags' in manifest:
                res['tags'] = manifest['tags']
            if 'description' in manifest:
                res['description'] = manifest['description']
            if 'status' in manifest:
                res['status'] = manifest['status']
            if 'url' in manifest:
                res['url'] = manifest['url']
            if 'archived' in manifest:
                res['archived'] = manifest['archived']
            if 'analysis' in manifest:
                res['analysis'] = manifest['analysis']
            if 'hypothesis' in manifest:
                res['hypothesis'] = manifest['hypothesis']
            if 'team' in manifest:
                res['team'] = manifest['team']
            if 'futute_work' in manifest:
                res['future_work'] = manifest['future_work']
            if 'related_projects' in manifest:
                res['related_projects'] = manifest['related_projects']
            if 'date_creation' in manifest:
                res['date_creation'] = manifest['date_creation']

            res['_id'] = str(project_id)
            is_valid = g.validator.is_valid(res)
            if is_valid and current_user_has_permission_to_change(res):
                res['date_last_updated'] = time.strftime("%Y-%m-%d")
                res['_id'] = project_id
                res['authors'] = sorted(list(set(res['authors'])))
                res['tags'] = sorted(res['tags'])
                g.projects.find_one_and_replace({'_id': project_id}, res,
                                                return_document=ReturnDocument.AFTER)

                add_notification(current_user['email'], manifest['authors'], "update",
                                 project_id=project_id, reason='author')
                add_notification(current_user['email'], g.users_with_bookmark(project_id), "update",
                                 project_id=project_id, reason='bookmark')
                add_notification(current_user['email'],
                                 [comment['author'] for comment in res['comments']], "update",
                                 project_id=project_id, reason='comment')
                add_self_action(current_user['email'], "update", project_id=project_id)
                g.rerun_saved_searches(current_user['email'], project_id, "update")

                return make_response("Success")
            elif not current_user_has_permission_to_change(manifest):
                raise ApiException("You are not allowed to edit this project", 403)
            else:
                raise ApiException(
                    "Validation Error: \n" + str(is_valid), 400,
                    [error for error in sorted(g.validator.iter_errors(manifest))])
        else:
            raise ApiException("Manifest had wrong format", 400)
    except ApiException as error:
        raise error
    except UnicodeDecodeError:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)
