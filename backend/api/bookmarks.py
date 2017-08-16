from flask import jsonify, make_response, g, Blueprint
from flask_security import login_required, current_user
from api.notifications import add_notification
from api.helper.apiexception import ApiException


bookmarks = Blueprint('api_bookmarks', __name__)


@bookmarks.route('/api/bookmarks/<uuid:id>', methods=['POST'])
@login_required
def add_bookmarks(id):
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    if id in user.bookmarks:
        return make_response("Project is already bookmarked.", 400)
    user.bookmarks.append(id)
    user.save()
    projects = [g.projects.find_one({'_id': project_id})
                for project_id in user.bookmarks]

    try:
        for project in projects:
            project['is_bookmark'] = 'true'
            project['is_owner'] = 'true' if current_user['email'] in project['authors']\
                else 'false'
            add_notification(current_user['email'], project['authors'], project['_id'], "bookmark")
        return jsonify(projects)

    except KeyError as err:
        raise ApiException(str(err), 500)


@bookmarks.route('/api/bookmarks/<uuid:id>', methods=['DELETE'])
@login_required
def delete_bookmarks(id):
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    if id in user.bookmarks:
        user.bookmarks.remove(id)
        user.save()
        projects = [g.projects.find_one({'_id': project_id}) for project_id in user['bookmarks']]

        try:
            for project in projects:
                project['is_bookmark'] = 'true'
                project['is_owner'] = 'true' if current_user['email'] in project['authors']\
                    else 'false'

            return make_response("Success", 200)

        except KeyError as err:
            raise ApiException(str(err), 500)
    return make_response("Project is not bookmarked: " + str(id), 400)


@bookmarks.route('/api/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    projects = [g.projects.find_one({'_id': project_id}) for project_id in current_user.bookmarks]
    for project in projects:
        project['is_bookmark'] = 'true'
    projects = list(filter(None.__ne__, projects))
    return jsonify(projects)
