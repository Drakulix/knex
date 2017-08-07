import time
import uuid

from flask import request, jsonify, make_response, g, Blueprint
from pymongo.collection import ReturnDocument
from flask_security import login_required, current_user

from api.helper.apiexception import ApiException
from api.helper.permissions import current_user_has_permission_to_change
from api.notifications import add_notification

from globals import ADMIN_PERMISSION

comments = Blueprint('api_comments', __name__)


@comments.route('/api/projects/<uuid:project_id>/comment', methods=['POST'])
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
        comment = {}
        comment['author'] = current_user['email']
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

            notifications.add_notification(current_user['email'], manifest['authors'], project_id,\
                "comment", reason='author')
            notifications.add_notification(current_user['email'],\
                g.users_with_bookmark(project_id), project_id, "comment", reason='bookmark')
            notifications.add_notification(current_user['email'],\
                [comment['author'] for comment in manifest['comments']], project_id,\
                 "comment", reason='comment')

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


@comments.route('/api/projects/<uuid:project_id>/comment', methods=['GET'])
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


@comments.route('/api/projects/<uuid:project_id>/comment', methods=['DELETE'])
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


@comments.route('/api/projects/<uuid:project_id>/comment/<uuid:comment_id>', methods=['PUT'])
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
                if not current_user_has_permission_to_change(comment):
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


@comments.route('/api/projects/<uuid:project_id>/comment/<uuid:comment_id>', methods=['DELETE'])
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
                if not current_user_has_permission_to_change(comment):
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
