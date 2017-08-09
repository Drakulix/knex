from flask import request, make_response, g, Blueprint
from flask_security import login_required, current_user

from api.helper.apiexception import ApiException
from api.notifications import add_notification


share = Blueprint('api_share', __name__)


@share.route('/api/projects/<uuid:project_id>/share/<user_mail>', methods=['POST'])
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
    add_notification(current_user['email'], [user_mail], 'share', project_id=project_id)
    return make_response("Success", 200)


@share.route('/api/projects/<uuid:project_id>/share', methods=['POST'])
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
    add_notification(current_user['email'], emails_list, 'share', project_id=project_id)
    return make_response("Success", 200)
