from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, current_user
from api.helper.apiexception import ApiException
from api.helper.permissions import current_user_has_permission_to_change
from api.helper.search import prepare_mongo_query


import time
import pymongo
import uuid

import sys


notifications = Blueprint('api_notifications', __name__)


def add_notification(creator, userlist, operation, project_id=None,
                     reason=None, saved_search_id=None):
    date = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
    for user in userlist:
        if user not in (creator):
            user_object = g.user_datastore.get_user(user)
            if user_object:
                notifications_settings = user_object['notifications_settings']
                if operation not in notifications_settings\
                        or notifications_settings[operation] == 'true':
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


def add_self_action(creator, operation, project_id=None, user_id=None):
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


def add_project_notification(creator, operation, project):
    project_id = project['_id']
    add_notification(creator, project['authors'], operation,
                     project_id=project_id, reason='author')
    add_notification(creator, g.users_with_bookmark(project_id), operation,
                     project_id=project_id, reason='bookmark')
    add_notification(creator,
                     [comment['author'] for comment in project['comments']], operation,
                     project_id=project_id, reason='comment')
    add_self_action(creator, operation, project_id=project_id)
    rerun_saved_searches(creator, project_id, operation)


def delete_project_notification(project_id):
    g.notifications.delete_many({'project_id': project_id})


def delete_user_notification(user_id):
    g.notifications.delete_many({'creator': user_id})
    g.notifications.delete_many({'user_id': user_id})


def extend_notification_list(notification_list):
    userlist = {notification['user_id'] for notification in notification_list}
    userlist = userlist.union({notification['creator'] for notification in notification_list})

    userlist = [g.user_datastore.find_user(email=mail) for mail in userlist
                if g.user_datastore.find_user(email=mail)]
    name_list = dict([(user.email, (user.first_name + " " + user.last_name).strip())
                     for user in userlist])

    projects = list({notification['project_id'] for notification in notification_list})
    projectlist = g.projects.find({'_id': {'$in': projects}}, {"_id": 1, "title": 1})
    projectlist = dict([(str(project['_id']), project['title']) for project in projectlist])
    for notification in notification_list:
        notification['creator_name'] = name_list[notification['creator']]
        notification['user_name'] = name_list[notification['user_id']]
        if notification['project_id'] and str(notification['project_id']) in projectlist:
            notification['project_title'] = projectlist[str(notification['project_id'])]
        else:
            notification['project_title'] = ""
    return [dict(notification) for notification in notification_list]


@notifications.route('/api/users/actions', methods=['GET'])
@login_required
def get_actions():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 404)
    res = g.notifications.find({'user_id': current_user['email']})\
        .sort('date', pymongo.DESCENDING).limit(20)
    notification_list = extend_notification_list(list(res))

    return jsonify(notification_list)


@notifications.route('/api/users/notifications/<email:mail>', methods=['GET'])
@login_required
def get_actions_of_user(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("user not found", 404)
    res = g.notifications.find({'creator': mail,
                               'operation': {'$in': ['create', 'comment', 'update', 'archive']}})\
        .sort('date', pymongo.DESCENDING).limit(20)
    notification_list = extend_notification_list(list(res))
    return jsonify(notification_list)


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
    notification = request.get_json()
    notification_id = notification["_id"]
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 404)
    res = g.notifications.update_one({'_id': notification_id}, {'$set': {'active': 'false'}})
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


@notifications.route('/api/users/notifications/settings', methods=['GET'])
@login_required
def get_notification_settings():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    return jsonify(user['notifications_settings'])


@notifications.route('/api/users/notifications/settings', methods=['PUT'])
@login_required
def put_notification_settings():
    settings = request.get_json()
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 404)
    user['notifications_settings'] = settings
    user.save()
    return make_response("Notification settings updated", 200)


def rerun_saved_searches(creator, project_id, operation):
    for user in g.user_datastore.user_model.objects:
        for search in user.saved_searches:
            query = search.to_dict()
            preparedQuery = prepare_mongo_query(query['metadata'])
            search['count'] = g.projects.count(preparedQuery)
            search.save()
            if g.projects.count(preparedQuery) == 1:
                add_notification(creator, user['email'], operation, project_id=project_id,
                                 reason='search', saved_search_id=query['id'])
