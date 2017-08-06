from flask import request, make_response, g, Blueprint
from flask_security import login_required, current_user
from werkzeug.utils import secure_filename

import os
import sys
import base64
import mimetypes


from api.helper.images import Identicon
from api.helper.permissions import current_user_has_permission_to_change

avatars =  Blueprint('api_avatars', __name__)



@avatars.route('/api/users/<email:mail>/avatar', methods=['GET'])
@login_required
def get_user_avatar(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("Unknown User with Email-address: " + str(mail), 404)
    filedata = base64.b64decode(user.avatar)
    response = make_response(filedata)
    response.headers['Content-Type'] = mimetypes.guess_type(user.avatar_name)
    response.headers['Content-Disposition'] = 'attachment; filename=' + user.avatar_name
    return response


@avatars.route('/api/users/<email:mail>/avatar', methods=['POST'])
@login_required
def set_user_avatar(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("Unknown User with Email-address: " + str(mail), 404)
    if not current_user_has_permission_to_change(user):
        raise ApiException("Current User has no permission for the requested user.", 403)
    if 'file' not in request.files:
        raise ApiException("request.files contains no image", 400)
    file = request.files['file']
    if 'image/' not in file.mimetype:
        raise ApiException("File mimetype must be 'image/<filetype>'", 400)
    user.avatar_name = secure_filename(file.filename)
    user.avatar = base64.b64encode(file.read()).decode()
    user.save()
    return make_response("Avatar successfully replaced.", 200)


@avatars.route('/api/users/<email:mail>/avatar', methods=['DELETE'])
@login_required
def reset_user_avatar(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("Unknown User with Email-address: " + str(mail), 404)
    if not current_user_has_permission_to_change(user):
        raise ApiException("Current User has no permission for the requested user.", 403)
    image = Identicon(mail)
    result = image.generate()
    with open(os.path.join(sys.path[0], 'identicon' + mail + '.png'), 'rb') as tf:
        imgtext = base64.b64encode(tf.read())
    os.remove(sys.path[0] + '/identicon' + mail + '.png')
    user.avatar = imgtext.decode()
    user.avatar_name = 'identicon' + mail + '.png'
    user.save()
    return make_response("Success", 200)
