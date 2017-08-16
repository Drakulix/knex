from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, current_user
from api.helper.apiexception import ApiException
import time
import pymongo
import uuid


notifications = Blueprint('api_notifications', __name__)


def add_notification(creator, userlist, operation, project_id='',
                     reason='', saved_search_id=''):
    date = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    for user in userlist:
        if user not in (creator):
            g.notifications.insert_one({
                '_id': str(uuid.uuid4()),
                'creator': creator,
                'user_id': user,
                'project_id': project_id,
                'operation': operation,
                'date': date,
                'reason': reason,
                'active': 'true',
                'saved_search_id': saved_search_id
            })


def add_self_action(creator, operation, project_id='', user_id=None):
    date = time.strftime("%Y-%m-%d %H:%M:%S")
    if not user_id:
        user_id = creator
    g.notifications.insert_one({
        '_id': str(uuid.uuid4()),
        'creator': creator,
        'user_id': user_id,
        'project_id': project_id,
        'operation': operation,
        'date': date,
        'active': 'false'
    })


def delete_project_notification(project_id):
    g.notifications.delete_many({'project_id': project_id})


def delete_user_notification(user_id):
    g.notifications.delete_many({'creator': user_id})
    g.notifications.delete_many({'user_id': user_id})


@notifications.route('/api/users/actions', methods=['GET'])
@login_required
def get_actions():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 404)
    res = g.notifications.find({'user_id': current_user['email']})\
        .sort('date', pymongo.DESCENDING).limit(20)
    return jsonify(list(res))


@notifications.route('/api/users/notifications/<email:mail>', methods=['GET'])
@login_required
def get_actions_of_user():
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("user not found", 404)
    res = g.notifications.find({'creator': mail,
                               'operation': {'$in': ['create', 'comment', 'update', 'archive']}})\
        .sort('date', pymongo.DESCENDING).limit(20)
    return jsonify(list(res))


@notifications.route('/api/users/notifications', methods=['GET'])
@login_required
def get_notifications():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 404)
    res = g.notifications.find({'user_id': current_user['email'], 'active': 'true'})\
        .sort('date', pymongo.DESCENDING).limit(20)
    return jsonify(list(res))


@notifications.route('/api/users/notifications/deactivate', methods=['PUT'])
@login_required
def deactivate_notification():
    request = request.get_json()
    notification_id = request["id"]
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 404)
    res = g.notifications.update_one({'_id': id}, {'$set': {'active': 'false'}})
    if res.modified_count == 0:
        return make_response("No notification with the given id known", 404)
    else:
        return make_response("Success", 200)


@notifications.route('/api/users/notifications/<id>', methods=['DELETE'])
@login_required
def delete_notification(id):
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    res = g.notifications.delete_one({'_id': id})
    if res.deleted_count == 0:
        return make_response("No notification with the given id known", 404)
    else:
        return make_response("Success", 200)
