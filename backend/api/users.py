import io
import os
import sys
import json
import base64
import mimetypes

from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, login_user, logout_user, current_user
from flask_security.utils import verify_password, hash_password
from mongoengine import NotUniqueError
from mongoengine.fields import ObjectId
from werkzeug.utils import secure_filename

from api.projects import get_all_authors
from api.helper.apiexception import ApiException


users = Blueprint('api_users', __name__)


def is_permitted(user, entry):
    """Return boolean value if user has admin permission, arg->list with roles

        Returns:
            res: true if user has admin role
        """

    if user.has_role('admin'):
        return True
    return user['email'] == entry['email']


@users.route('/api/users/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    user = g.user_datastore.get_user(email)
    if not user:
        return make_response("Username oder Password invalid", 403)

    if verify_password(password, user["password"]):
        login_user(user)
        return make_response("Login successful", 200)

    return make_response("Username oder Password invalid", 403)


@users.route('/api/users/logout')
def logout():
    logout_user()
    return make_response("Logged out", 200)


@users.route('/api/users', methods=['GET'])
@login_required
def get_all_users():
    users = g.user_datastore.user_model.objects
    return jsonify(sorted([user.to_dict() for user in users], key=lambda k: k.get('email').lower()))


@users.route('/api/users/authors', methods=['GET'])
@login_required
def get_all_users_and_authors():
    authors = json.loads(get_all_authors().get_data().decode())
    users = [user['email'] for user in json.loads(get_all_users().get_data().decode())]
    res = list(set(authors + users))
    return jsonify(sorted(res), key=lambda k: k.lower())


@users.route('/api/users/names', methods=['POST'])
@login_required
def get_usernames():
    userlist = [g.user_datastore.find_user(email=mail) for mail in request.get_json()
                if g.user_datastore.find_user(email=mail)]
    dic = dict([(user.email, (user.first_name + " " if user.first_name else "" + user.last_name))
                for user in userlist])
    return jsonify(dic)


@users.route('/api/users', methods=['POST'])
def create_user():
    try:
        user = request.get_json()

        if 'roles' not in user:
            raise ApiException("Passed json has no roles, please fix your request.", 400)

        if 'admin' in user['roles'] and not current_user.has_role('admin'):
            raise ApiException("Cannot create admin user. Insufficient permission.", 403)

        roles = [g.user_datastore.find_or_create_role(role) for role in user['roles']]

        with open(os.path.join(sys.path[0], "default_avatar.png"), 'rb') as tf:
            imgtext = base64.b64encode(tf.read()).decode()

        g.user_datastore.create_user(first_name=user['first_name'],
                                     last_name=user['last_name'],
                                     email=user['email'],
                                     password=hash_password(user['password']),
                                     bio=user['bio'], roles=roles,
                                     avatar_name="default_avatar.png",
                                     avatar=imgtext)

        usr = g.user_datastore.get_user(user['email'])
        return jsonify(usr.to_dict())

    except NotUniqueError:
        raise ApiException("Duplicated user error", 409)
    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)


@users.route('/api/users', methods=['PUT'])
@login_required
def update_user():
    user = request.get_json()
    if is_permitted(current_user, user):
        res = g.user_datastore.get_user(user['email'])
        if not res:
            return make_response("Unknown User with Email-address: " + user['email'], 400)

        res.first_name = user.get('first_name', res.first_name)
        res.last_name = user.get('last_name', res.last_name)
        res.bio = user.get('bio', res.bio)

        if 'roles' in user:
            if 'admin' in user['roles'] and not current_user.has_role('admin'):
                raise ApiException("Current user has no permission to assign admin role.", 403)
            if 'admin' not in user['roles'] and res.has_role('admin'):
                for usr in g.user_datastore.user_model.objects:
                    if usr.has_role('admin') and usr['email'] != user['email']:
                        res.roles = [g.user_datastore.find_or_create_role(role)
                                     for role in user['roles']]
                        break
                else:
                    raise ApiException("Can't unassign the admin role from the last admin.", 400)
            else:
                res.roles = [g.user_datastore.find_or_create_role(role) for role in user['roles']]

        res.save()

        return make_response("User with email: " + user['email'] + " updated", 200)

    return make_response("You don't have permission to edit this user", 403)


@users.route('/api/users/password', methods=['PUT'])
@login_required
def update_password():
    user = request.get_json()
    res = g.user_datastore.get_user(user['email'])
    if not res:
        return make_response("Unknown User with Email-address: " +
                             user['email'], 404)

    if current_user.has_role('admin') or verify_password(user["old_password"], res.password):
        new_password = user["new_password"]
        res.password = hash_password(new_password)
        res.save()
        return make_response("Password restored!", 200)

    return make_response("You don't have permission to edit this user", 400)


@users.route('/api/users/<email:mail>', methods=['DELETE'])
@login_required
def delete_user(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("user not found", 404)
    if is_permitted(current_user, user):
        if not user.has_role('admin'):
            g.user_datastore.delete_user(user)
            return make_response("deleted non admin", 200)
        else:
            for usr in g.user_datastore.user_model.objects:
                if usr.has_role('admin') and usr['email'] != user['email']:
                    g.user_datastore.delete_user(user)
                    return make_response("deleted", 200)
            raise ApiException("You are the last surviving admin, "
                               "you cannot delete yourself", 9001)

    else:
        make_response("Permission denied!", 403)


@users.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def get_user(mail):
    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
    """
    user = g.user_datastore.get_user(mail)
    if not user:
        return make_response("Unknown User with Email-address: " + str(mail), 404)

    res = user.to_dict()
    return jsonify(res)


@users.route('/api/users/<email:mail>/avatar', methods=['GET'])
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


@users.route('/api/users/<email:mail>/avatar', methods=['PUT'])
@login_required
def set_user_avatar(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("Unknown User with Email-address: " + str(mail), 404)
    if 'image' not in request.files:
        raise ApiException("request.files contains no image", 400)
    if 'image/' not in request.content_type:
        raise ApiException("Content-Type must be set to 'image/<filetype>'", 400)
    file = request.files['image']
    user.avatar_name = file.filename
    user.avatar = base64.b64encode(file.read()).decode()
    user.save()
    return make_response("Avatar successfully replaced.", 200)


@users.route('/api/users/<email:mail>/avatar', methods=['DELETE'])
@login_required
def reset_user_avatar(mail):
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("Unknown User with Email-address: " + str(mail), 404)
    with open(os.path.join(sys.path[0], "default_avatar.png"), 'rb') as tf:
        imgtext = base64.b64encode(tf.read())
    user.avatar = imgtext.decode()
    user.avatar_name = "default_avatar.png"
    user.save()
    return make_response("Success", 200)


@users.route('/api/users/<email:mail>/tags', methods=['GET'])
@login_required
def get_user_tags(mail):
    """Return topten tags of user

        Returns:
            res: Array with topten tags lexicographical order
    """
    try:
        pipeline = [{"$unwind": "$authors"},
                    {"$match": {"authors": mail}},
                    {"$unwind": "$tags"},
                    {"$group": {"_id": "$tags", "count": {"$sum": 1}}}
                    ]
        taglist = sorted(list(g.projects.aggregate(pipeline)), key=lambda k: k['count'],
                         reverse=True) if g.projects.aggregate(pipeline) else []

        toptags = taglist[0:10] if len(taglist) > 9 else taglist
        return jsonify(sorted([x['_id'] for x in toptags], key=str.lower))

    except Exception as err:
        raise ApiException(str(err), 500)


@users.route('/api/users/tags', methods=['GET'])
@login_required
def get_cur_user_tags():
    """Return topten tags of current_user

        Returns:
            res: Array with topten tags lexicographical order
    """
    try:
        pipeline = [{"$unwind": "$authors"},
                    {"$match": {"authors": current_user['email']}},
                    {"$unwind": "$tags"},
                    {"$group": {"_id": "$tags", "count": {"$sum": 1}}}
                    ]
        taglist = sorted(list(g.projects.aggregate(pipeline)), key=lambda k: k['count'],
                         reverse=True) if g.projects.aggregate(pipeline) else []

        toptags = taglist[0:10] if len(taglist) > 9 else taglist
        return jsonify(sorted([x['_id'] for x in toptags], key=str.lower))

    except Exception as err:
        raise ApiException(str(err), 500)


@users.route('/api/users/bookmarks/<uuid:id>', methods=['POST'])
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

        return jsonify(projects)

    except KeyError as err:
        raise ApiException(str(err), 500)


@users.route('/api/users/bookmarks/<uuid:id>', methods=['DELETE'])
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


@users.route('/api/users/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    projects = [g.projects.find_one({'_id': project_id}) for project_id in user['bookmarks']]
    projects = list(filter(None.__ne__, projects))
    try:
        for project in projects:
            project['is_bookmark'] = 'true'
            project['is_owner'] = 'true' if current_user['email'] in project['authors']\
                else 'false'

        return jsonify(projects)

    except KeyError as err:
        raise ApiException(str(err), 500)


@users.route('/api/users/notifications', methods=['GET'])
@login_required
def get_notifications():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    return jsonify([notification.to_dict() for notification in user.notifications])


@users.route('/api/users/notifications/<id>', methods=['DELETE'])
@login_required
def delete_notification(id):
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)

    for notification in user.notifications:
        if notification.notification_id == ObjectId(id):
            user.notifications.remove(notification)
            user.save()
            return make_response("Success", 200)
    return make_response("No notification with the given id known", 404)
