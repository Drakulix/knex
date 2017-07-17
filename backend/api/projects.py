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
from globals import ADMIN_PERMISSION


projects = Blueprint('api_projects', __name__)


def is_permitted(user, entry):
    """Return boolean value if user has admin permission, arg->list with roles

        Returns:
            res: true if user has admin role
        """

    if user.has_role('admin'):
        return True
    elif 'author' in entry:
        return user['email'] == entry['author']['email']
    return user['email'] in entry['authors']


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
            return_ids = uploader.save_manifest_to_db(manifestlist)
            g.rerun_saved_searches()
            return jsonify(return_ids)
        except Exception as err:
            raise ApiException(str(err), 400)

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

            g.rerun_saved_searches()
            return jsonify(return_ids)

        except ApiException as e:
            raise e

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
    argc = len(request.args)

    if g.projects.count() == 0:
        return make_response(jsonify([]), 200)
    query = {}
    if archived == 'true':
        query = {'archived': True}
    elif archived == 'false':
        query = {'archived': False}
    if limit and skip:
        res = g.projects.find(query, limit=limit, skip=skip)
    elif limit:
        res = g.projects.find(query, limit=limit)
    elif skip:
        res = g.projects.find(query, skip=skip)
    else:
        res = g.projects.find(query)

    try:
        res = [x for x in res[:]]
        for project in res:
            project['is_bookmark'] = 'true' if project['_id']\
                in current_user['bookmarks'] else 'false'
            project['is_owner'] = 'true' if current_user['email']\
                in [author['email'] for author in project['authors']] else 'false'
        return jsonify(res)
    except KeyError as err:
        raise ApiException(str(err), 400)


@projects.route('/api/projects/authors', methods=['GET'])
@login_required
def get_all_authors():
    try:
        authors = g.projects.distinct('authors')
        res = sorted(authors, key=lambda k: str(k['name']).lower()) if authors else []
        return jsonify(res)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/tags', methods=['GET'])
@login_required
def get_all_tags():
    try:
        tags = g.projects.distinct('tags')
        return jsonify(sorted(tags, key=str.lower) if tags else [])
    except Exception as err:
        raise ApiException(str(err), 500)


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
        res = g.projects.find_one({'_id': project_id, 'archived': True})
    elif archived == 'false':
        res = g.projects.find_one({'_id': project_id, 'archived': False})
    elif archived == 'mixed':
        res = g.projects.find_one({'_id': project_id})
    else:
        return make_response('Invalid parameters', 400)
    if res is None:
        return make_response("Project not found", 404)
    try:
        res['is_bookmark'] = 'true' if project_id in current_user['bookmarks'] else 'false'
        res['is_owner'] = 'true' if current_user['email']\
            in [author['email'] for author in res['authors']] else 'false'
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
    g.rerun_saved_searches()
    return make_response("Success")


@projects.route('/api/projects/<uuid:project_id>/archive/<string:archived>', methods=['PUT'])
@login_required
def archive_project(project_id, archived):
    archived = True if archived == "true" else False if archived == "false" else None
    if archived is None:  # we don't want to evaluate to bool
        raise ApiException("Argument <string:archived> must be 'true' or 'false'", 400)
    manifest = g.projects.find_one({'_id': project_id})
    if not manifest:
        raise ApiException("Project not found", 404)
    if not is_permitted(current_user, manifest):
        raise ApiException("User is not permitted to archive this project", 403)
    manifest['archived'] = archived
    g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                    return_document=ReturnDocument.AFTER)
    g.notify_users(
        list(set(
            [author['email'] for author in manifest['authors']] +
            g.users_with_bookmark(str(manifest['_id']))
        )), "Project was archived", manifest['title'],
        '/project/' + str(manifest['_id']))
    g.rerun_saved_searches()
    return make_response("Project was successfully archived.", 200)


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
        if not res:
            raise ApiException("Project not found", 404)
        elif request.is_json or "application/json5" in request.content_type:
            manifest = request.get_json() if request.is_json \
                else json5.loads(request.data.decode("utf-8"))
            if manifest['_id'] != str(project_id):
                return make_response("project_id and json['_id'] do not match.", 409)
            manifest['_id'] = str(project_id)
            is_valid = g.validator.is_valid(manifest)
            if is_valid and is_permitted(current_user, manifest):
                manifest['date_last_updated'] = time.strftime("%Y-%m-%d")
                manifest['_id'] = project_id
                g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                return_document=ReturnDocument.AFTER)
                g.notify_users(
                    list(set(
                        [author['email'] for author in manifest['authors']] +
                        g.users_with_bookmark(str(manifest['_id']))
                    )), "Project was updated", manifest['title'],
                    '/project/' + str(manifest['_id']))
                g.rerun_saved_searches()
                return make_response("Success")
            elif not is_permitted(current_user, manifest):
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


@projects.route('/api/projects/<uuid:project_id>/comment', methods=['POST'])
@login_required
def add_comment(project_id):
    """Adds new comment to project by project_id

    Args:
        project_id, comment in string format

    Returns:
        response: Success response
                  or 404 if project is not found
                  or 400 if validation error occurs
    """
    try:
        manifest = g.projects.find_one({'_id': project_id})
        if not manifest:
            raise ApiException("Project not found", 404)
        if "text/plain" not in request.content_type:
            raise ApiException("'text/plain' must be in Content-Type", 400)
        comment = dict()
        author = dict()
        firstname = current_user['first_name'] if 'first_name' in current_user else ""
        lastname = current_user['last_name'] if 'last_name' in current_user else ""
        author['name'] = firstname + " " if firstname else "" + lastname
        author['email'] = current_user['email']
        comment['author'] = author
        comment['datetime'] = time.strftime("%Y-%m-%d %H:%M:%S")
        comment['id'] = str(uuid.uuid4())
        comment['message'] = request.data.decode('utf-8')
        if 'comments' in manifest and isinstance(manifest['comments'], list):
            manifest['comments'].append(comment)
        else:
            manifest['comments'] = [comment]
        manifest['_id'] = str(project_id)
        is_valid = g.validator.is_valid(manifest)
        if is_valid:
            manifest['_id'] = project_id
            g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                            return_document=ReturnDocument.AFTER)
            g.notify_users(
                list(set(
                    [author['email'] for author in manifest['authors']] +
                    [comment['author']['email'] for comment in manifest['comments']])),
                "New comment", author["name"] + " commented on " + manifest["title"],
                '/project/' + str(manifest['_id']))
            return jsonify(comment['id'])
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


@projects.route('/api/projects/<uuid:project_id>/comment', methods=['GET'])
@login_required
def get_comment(project_id):
    """Gets all comments of project sorted by descending creation date

    Args:
        project_id

    Returns:
        response: Success response
                  or 404 if project is not found
    """
    try:
        project = g.projects.find_one({'_id': project_id})
        if not project:
            raise ApiException("Project not found", 404)

        res = sorted(project['comments'], key=lambda k: k['datetime'], reverse=True) \
            if 'comments' in project and isinstance(project['comments'], list) else []
        return jsonify(res)
    except ApiException as error:
        raise error
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/comment', methods=['DELETE'])
@login_required
@ADMIN_PERMISSION.require()
def delete_comments(project_id):
    """Deletes all comments of project

    Args:
        project_id

    Returns:
        response: Success response
                  or 404 if project is not found
                  or 400 if validation error occurs
    """
    try:
        manifest = g.projects.find_one({'_id': project_id})
        if not manifest:
            raise ApiException("Project not found", 404)
        if 'comments' in manifest:
            del manifest['comments']
            manifest['_id'] = str(project_id)
            is_valid = g.validator.is_valid(manifest)
            if is_valid:
                manifest['_id'] = project_id
                g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                return_document=ReturnDocument.AFTER)
                return make_response("Success", 200)
            else:
                raise ApiException(
                    "Validation Error: \n" + str(is_valid), 400,
                    [error for error in sorted(g.validator.iter_errors(manifest))])
        raise ApiException("Project has no comments", 404)
    except ApiException as error:
        raise error
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/comment/<uuid:comment_id>', methods=['PUT'])
@login_required
def update_comment(project_id, comment_id):
    """Updates edited comment

    Args:
        project_id, comment_id, comment in string format

    Returns:
        response: Success response
                  or 404 if project or comment is not found
                  or 400 if validation error occurs
    """
    try:
        manifest = g.projects.find_one({'_id': project_id})
        if not manifest:
            raise ApiException("Project not found", 404)
        if 'text/plain' not in request.content_type:
            raise ApiException("Content-Type header must include 'text/plain'", 400)

        if 'comments' not in manifest or not manifest['comments']:
            raise ApiException("Project has no comments", 404)

        elif not isinstance(manifest['comments'], list):
            raise ApiException("json['comments'] must be a list of comments.", 400)

        for comment in manifest['comments']:
            if str(comment_id) == comment['id']:
                if not is_permitted(current_user, comment):
                    raise ApiException("Permission denied", 403)
                comment['message'] = request.data.decode('utf-8')
                manifest['_id'] = str(project_id)
                is_valid = g.validator.is_valid(manifest)
                if is_valid:
                    manifest['_id'] = project_id
                    g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                    return_document=ReturnDocument.AFTER)
                    return make_response("Success", 200)
                else:
                    raise ApiException(
                        "Validation Error: \n" + str(is_valid), 400,
                        [error for error in sorted(g.validator.iter_errors(manifest))])

        raise ApiException("Comment not found", 404)

    except ApiException as error:
        raise error
    except UnicodeDecodeError:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/comment/<uuid:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(project_id, comment_id):
    """Deletes comment by comment_id

    Args:
        project_id, comment_id

    Returns:
        response: Success response
                  or 404 if project is not found
                  or 500 if validation error occurs
    """
    try:
        manifest = g.projects.find_one({'_id': project_id})
        if not manifest:
            raise ApiException("Project not found", 404)

        if 'comments' not in manifest or not manifest['comments']:
            raise ApiException("Project has no comments", 404)

        elif not isinstance(manifest['comments'], list):
            raise ApiException("json['comments'] must be a list of comments.", 400)

        for comment in manifest['comments']:
            if str(comment_id) == comment['id']:
                if not is_permitted(current_user, comment):
                    raise ApiException("permission denied", 403)
                manifest['comments'].remove(comment)
                if not manifest['comments']:
                    del manifest['comments']
                manifest['_id'] = str(project_id)
                is_valid = g.validator.is_valid(manifest)
                if is_valid:
                    manifest['_id'] = project_id
                    g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                    return_document=ReturnDocument.AFTER)
                    return make_response("Success", 200)
                else:
                    raise ApiException(
                        "Validation Error: \n" + str(is_valid), 500,
                        [error for error in sorted(g.validator.iter_errors(manifest))])
        raise ApiException("Comment not found", 404)
    except ApiException as error:
        raise error
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/share/<user_mail>', methods=['POST'])
@login_required
def share_via_email(project_id, user_mail):
    """Creates and saves notification object

        Returns:
            res: Notification object as json
    """
    user = g.user_datastore.get_user(user_mail)
    if not user:
        return make_response("Unknown User with Email-address: " + user_mail, 404)
    res = g.projects.find_one({'_id': project_id})
    if not res:
        raise ApiException("Project not found", 404)

    description = res["title"] + "was shared with you."
    link = "/project/" + str(project_id)
    title = "Project shared."
    return g.notify_users([user_mail], description, title, link)


@projects.route('/api/projects/<uuid:project_id>/share', methods=['POST'])
@login_required
def share_with_users(project_id):
    """Creates and saves notification object

        Returns:
            res: Notification object as json
    """
    emails_list = request.get_json()
    res = g.projects.find_one({'_id': project_id})
    if not res:
        raise ApiException("Project not found", 404)

    description = res["title"] + "was shared with you"
    link = "/project/" + str(project_id)
    title = "Project shared"
    return g.notify_users(emails_list, description, title, link)
