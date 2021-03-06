from flask import jsonify, g, Blueprint, request
from flask_security import login_required, current_user

from api.helper.apiexception import ApiException

from uuid import UUID


projects_meta = Blueprint('api_projects_meta', __name__)


def init_project_meta(project_id, time):
    user_mail = current_user['email'].replace(".", "§")
    if not g.projects_meta.find_one({'_id': project_id}):
        g.projects_meta.insert_one({'_id': project_id,
                                    'visits': 0,
                                    'change': {},
                                    'last_access': {user_mail: time}
                                    })


def delete_project_meta(project_id):
    g.projects_meta.delete_one({'_id': project_id})


def delete_project_meta_user_data(user_mail):
    user_mail = user_mail.replace(".", "§")
    g.projects_meta.update({}, {'$unset': {'last_access.' + user_mail: 1}})


def set_last_access(project_id, time):
    user_mail = current_user['email'].replace(".", "§")
    visits_count = g.projects_meta.find_one({'_id': project_id}, {'visits': 1})
    g.projects_meta.update({'_id': project_id},
                           {'$set':
                               {'last_access.' + user_mail: time,
                                'visits': visits_count['visits'] + 1
                                }
                            },
                           upsert=True)


def set_updated_fields(project_id, fields, time):
    fields = dict([(field, time) for field in fields])
    g.projects_meta.update({'_id': project_id},
                           {'$set': {'change.' + field: time for field in fields}},
                           upsert=True)


@projects_meta.route('/api/projects/meta', methods=['POST'])
@login_required
def get_project_list_meta():
    """ Returns a dictionary of each project in the database as key and
        its meta data as value.
    """
    projects = [UUID(project_id) for project_id in set(request.get_json())]
    res = [(str(project_id), get_meta_data(project_id)) for project_id in projects]
    return jsonify(dict(res))


@projects_meta.route('/api/projects/<uuid:project_id>/meta', methods=['GET'])
@login_required
def get_project_meta_by_id(project_id):
    """Returns project meta information by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project meta data corresponding to the ID
    """
    if not g.projects_meta.find_one({'_id': project_id}):
        return make_response("Project not found", 404)
    res = get_meta_data(project_id)
    return jsonify(res)


def get_meta_data(project_id):
    meta = g.projects_meta.find_one({'_id': project_id})
    res = {}
    project = g.projects.find_one({'_id': project_id})
    res['is_bookmark'] = project_id in current_user['bookmarks']
    res['is_owner'] = current_user['email'] in project['authors']
    res['archived'] = project['archived']
    res['comment_count'] = len(project['comments'])
    userlist = [g.user_datastore.find_user(email=mail) for mail in project['authors']
                if g.user_datastore.find_user(email=mail)]
    res['authors'] = dict([(user.email, (user.first_name + (" "
                          if user.first_name and user.last_name else "") + user.last_name))
                          for user in userlist])
    acces_dict = dict(meta['last_access'])
    res['last_access'] = acces_dict[current_user['email'].replace('.', '§')]
    res['visits'] = meta['visits']
    res['change'] = dict([(field, meta['change'][field] > res['last_access'])
                         for field in meta['change']])
    return res
