from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, current_user
import time
import pymongo


notifications = Blueprint('api_notifications', __name__)


def add_notification(creator, userlist, project_id, operation, reason='', saved_search_id=''):
    date = time.strftime("%Y-%m-%d %H:%M:%S")
    for user in userlist:
        if user not in (creator):
            g.notifications.insert_one({
                'creator': creator,
                'user_id': user,
                'project_id': project_id,
                'operation': operation,
                'date': date,
                'reason': reason,
                'active': 'true',
                'saved_search_id': saved_search_id
            })

def delete_project_notification(project_id):
    g.notifications.delete_many({'project_id': project_id})


@notifications.route('/api/users/notifications', methods=['GET'])
@login_required
def get_notifications():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    res = g.notifications.find({'user': current_user['email']})\
        .sort('date', pymongo.DESCENDING).limit(20)
    return jsonify([notification.to_dict() for notification in res])


@notifications.route('/api/users/notifications/<id>', methods=['DELETE'])
@login_required
def delete_notification(id):
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    res = g.notification.delete_one({'_id' : id})
    if res.deleted_count == 0:
        return make_response("No notification with the given id known", 404)
    else:
        return make_response("Success", 200)
