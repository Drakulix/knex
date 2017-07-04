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
@login_required
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
            if is_valid and is_permitted(current_user, manifest):
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
            elif not is_permitted(current_user, manifest):
                raise ApiException("You are not allowed to edit this project", 403)
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


@projects.route('/api/projects/<uuid:project_id>/comment', methods=['PUT'])
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
        if manifest is None:
            raise ApiException("Project not found", 404)
        if "text/plain" not in request.content_type:
            raise ApiException("Comment had not format string", 400)
        comment = {}
        comment['author'] = current_user.email
        author = g.user_datastore.get_user(current_user.email)
        comment['authors_name'] = author['first name']+" "+author['last name']
        comment['datetime'] = time.strftime("%Y-%m-%d %H:%M")
        comment['id'] = uuid.uuid4()
        comment['message'] = request.data.decode("utf-8")
        manifest['comments'] = manifest['comments'].append(comment)\
            if manifest['comments'] else [comment]
        is_valid = g.validator.is_valid(manifest)
        if is_valid:
            g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                            return_document=ReturnDocument.AFTER)
            make_response("Success")
        else:
            validation_errs = [error for error in
                               sorted(g.validator.iter_errors(manifest))]
            if validation_errs is not None:
                raise ApiException("Validation Error: \n" +
                                   str(is_valid), 400, validation_errs)
    except ApiException as error:
        raise error
    except UnicodeDecodeError as unicodeerr:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/comment', methods=['GET'])
@login_required
def add_comment(project_id):
    """Adds new comment to project by project_id

    Args:
        project_id, comment in string format

    Returns:
        response: Success response
                  or 404 if project is not found
    """
    try:
        manifest = g.projects.find({'_id': project_id}, projection='comments').sort(
                   key=lambda x: x['datetime'], reverse=True)
        if manifest is None:
            raise ApiException("Project not found", 404)
        return jsonify(manifest['comments'])
    except ApiException as error:
        raise error
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/comment', methods=['DELETE'])
@login_required
def delete_comments(project_id):
    """Adds new comment to project

    Args:
        project_id, comment in string format

    Returns:
        response: Success response
                  or 404 if project is not found
                  or 400 if validation error occurs
    """
    try:
        manifest = g.projects.find_one({'_id': project_id})
        if manifest is None:
            raise ApiException("Project not found", 404)
        del manifest[comments]
        is_valid = g.validator.is_valid(manifest)
        if is_valid:
            g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                            return_document=ReturnDocument.AFTER)
            make_response("Success")
        else:
            validation_errs = [error for error in
                               sorted(g.validator.iter_errors(manifest))]
            if validation_errs is not None:
                raise ApiException("Validation Error: \n" +
                                   str(is_valid), 400, validation_errs)
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
        if manifest is None:
            raise ApiException("Project not found", 404)
        if 'text/plain' not in request.content_type:
            raise ApiException("Content-Type header must include 'text/plain'", 400)

        if not manifest['comments']:
            raise ApiException("Project has no comments", 404)
        # TODO Usermanagement
        comment_msg = request.data.decode('utf-8')
        for comment in manifest['comments']:
            if str(comment_id) == str(comment['id']):
                comment['message'] = comment_msg
                is_valid = g.validator.is_valid(manifest)
                if is_valid:
                    g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                    return_document=ReturnDocument.AFTER)
                    make_response("Success", 200)
                else:
                    raise ApiException(
                        "Validation Error: \n" + str(is_valid), 400,
                        [error for error in sorted(g.validator.iter_errors(manifest))])

        raise ApiException("Comment not found", 404)

    except ApiException as error:
        raise error
    except UnicodeDecodeError as unicodeerr:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects.route('/api/projects/<uuid:project_id>/comment/<uuid:comment_id>', methods=['DELETE'])
@login_required
def delete_comment(project_id, comment_id):
    """Deletes comment

    Args:
        project_id, comment_id

    Returns:
        response: Success response
                  or 404 if project is not found
                  or 400 if validation error occurs
    """
    try:
        manifest = g.projects.find_one({'_id': project_id})
        if manifest is None:
            raise ApiException("Project not found", 404)
        comments = manifest[comments]
        if not manifest[comments]:
            deleted = 0
        else:
            deleted = 0
            for comment in manifest[comments]:
                if str(comment_id) == comment[commentId]:
                    manifest[comments].remove(comment)
                    deleted = comment
                    print("deleted", file=sys.stderr)
                    print(deleted, file=sys.stderr)
                    break
        if deleted == 0:
            raise ApiException("Comment not found", 404)
        elif not manifest[comments]:
            del manifest[comments]
        else:
            is_valid = g.validator.is_valid(manifest)
            if is_valid:
                g.projects.find_one_and_replace({'_id': project_id}, manifest,
                                                return_document=ReturnDocument.AFTER)
                make_response("Success")
            else:
                validation_errs = [error for error in
                                   sorted(g.validator.iter_errors(manifest))]
                if validation_errs is not None:
                    raise ApiException("Validation Error: \n" +
                                       str(is_valid), 400, validation_errs)
    except ApiException as error:
        raise error
    except Exception as err:
        raise ApiException(str(err), 500)
