from flask import jsonify, g, Blueprint
from flask_security import login_required, current_user

from api.helper.apiexception import ApiException

from uuid import UUID
import time

projects_meta = Blueprint('api_projects_meta', __name__)


def init_project_meta(project_id):
    if not g.projects_meta.find_one({'_id': project_id}):
        g.projects_meta.insert_one({'_id': project_id, 'visits': 0, 'last_access' : {}})


def delete_project_meta(project_id):
    g.projects_meta.delete_one({'_id': project_id})


def set_last_access(project_id):
    user_mail = current_user['email'].replace(".", "§")
    visits_count = g.projects_meta.find_one({'_id': project_id}, {'visits': 1})
    g.projects_meta.update({'_id': project_id},
                            { '$set':
                                { "last_access." + user_mail: time.strftime("%Y-%m-%d %H:%M:%S",
                                    time.gmtime()),
                                    'visits' : visits_count['visits'] + 1
                                }
                            },
                            upsert=True)


@projects_meta.route('/api/projects/<uuid:project_id>/meta', methods=['GET'])
def get_project_meta__by_id(project_id):
    """Returns project meta information by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project meta data corresponding to the ID
    """

    meta = g.projects_meta.find_one({'_id': project_id})


    if not meta:
        return make_response("Project not found", 404)
    try:
        res = {}
        project = g.projects.find_one({'_id': project_id})
        res['is_bookmark'] = project_id in current_user['bookmarks']
        res['is_owner'] = current_user['email'] in project['authors']
        res['archived'] = project['archived']
        res['comment_count'] = len(project['comments'])

        userlist = [g.user_datastore.find_user(email=mail) for mail in project['authors']
            if g.user_datastore.find_user(email=mail)]
        res['authors'] = dict([(user.email, (user.first_name + (" "
                            if user.first_name and user.last_name  else "") + user.last_name))
                            for user in userlist])
        acces_dict = dict(meta['last_access'])
        res['visits'] = meta['visits']
        res['last_access'] = acces_dict[current_user['email'].replace('.','§')]
    except KeyError as err:
        raise ApiException(str(err), 500)
    return jsonify(res)
