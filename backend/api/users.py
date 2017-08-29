""" Module users defines the web servers /api/users routes which
    provide all sort of user-related functionality.
"""

import os
import sys
import base64
import json
import mimetypes

from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, login_user, logout_user, current_user
from flask_security.utils import verify_password, hash_password
from mongoengine import NotUniqueError
from mongoengine.fields import ObjectId

from api.projectsInfo import get_all_authors
from api.helper.apiexception import ApiException
from api.helper.search import prepare_search_results
from api.helper.permissions import current_user_has_permission_to_change
from api.helper.images import Identicon
from api.notifications import add_notification, add_self_action, delete_user_notification


users = Blueprint('api_users', __name__)


@users.route('/api/users/login', methods=['POST'])
def login():
    """ Logs the user in. Expects a json in the format:
    { "email": <mail>, "password": <password> }
    """
    email = request.form['email']
    password = request.form['password']
    user = g.user_datastore.get_user(email)
    if not user:
        raise ApiException("Username oder Password invalid", 403)

    if verify_password(password, user["password"]):
        login_user(user)
        return make_response("Login successful", 200)

        raise ApiException("Username oder Password invalid", 403)


@users.route('/api/users/logout')
def logout():
    """ Logs the current user out.
    """
    logout_user()
    return make_response("Logged out", 200)


@users.route('/api/users', methods=['GET'])
@login_required
def get_all_users():
    """ Returns a list of all user jsons currently in the database.
    """
    users = g.user_datastore.user_model.objects
    return jsonify(sorted([user.to_dict() for user in users], key=lambda k: k.get('email').lower()))


@users.route('/api/users/projectids', methods=['GET'])
@login_required
def get_all_users_project_ids():
    """ Returns a dictionary of all users with their projects,
        value = user email and value = project id's.
    """
    dic = {}
    for user in g.user_datastore.user_model.objects:
        projects = json.loads(get_user_projects(user['email']).get_data().decode())
        project_ids = [project['_id'] for project in projects]
        dic[user['email']] = project_ids
    return jsonify(dic)


@users.route('/api/users/tags', methods=['GET'])
@login_required
def get_all_users_tags():
    dic = {}
    for user in g.user_datastore.user_model.objects:
        tags = json.loads(get_user_tags(user['email']).get_data().decode())
        dic[user['email']] = tags
    return jsonify(dic)


@users.route('/api/users/authors', methods=['GET'])
@login_required
def get_all_users_and_authors():
    """ Returns a list of all users and authors in the database.
    """
    authors = json.loads(get_all_authors().get_data().decode())
    users = [user['email'] for user in json.loads(get_all_users().get_data().decode())]
    res = list(set(authors + users))
    return jsonify(sorted(res, key=str.lower))


@users.route('/api/users/names', methods=['POST'])
@login_required
def get_usernames():
    """ Returns a dictionary of each user in the database as key and
        their name (concatinated) as value.
    """
    userlist = [g.user_datastore.find_user(email=mail) for mail in request.get_json()
                if g.user_datastore.find_user(email=mail)]
    dic = dict([(user.email, (user.first_name + (" " if user.first_name and user.last_name
                else "") + user.last_name))
                for user in userlist])
    return jsonify(dic)


@users.route('/api/users', methods=['POST'])
def create_user():
    """ Api Endpoint to create a user. Doesn't require login because of the register function.
        POST a json with 'email', 'password', 'roles', 'first_name', 'last_name', 'bio'.
        The new user will have a default avatar, can be replaced using PUT later.

        Returns: json of the user that was added to the database.

        Returns 409 if a user with the email already exists,
        403 if it's attempted to create an admin user without needed permissions or
        400 if 'roles' weren't supplied correctly.
    """
    try:
        user = request.get_json()

        if 'roles' not in user:
            raise ApiException("Passed json has no roles, please fix your request.", 400)

        if 'admin' in user['roles'] and not current_user.has_role('admin'):
            raise ApiException("Cannot create admin user. Insufficient permission.", 403)

        roles = [g.user_datastore.find_or_create_role(role) for role in user['roles']]

        image = Identicon(user['email'])
        result = image.generate()
        with open(os.path.join(sys.path[0], 'identicon' + user['email'] + '.png'), 'rb') as tf:
            imgtext = base64.b64encode(tf.read())
        os.remove(sys.path[0] + '/identicon' + user['email'] + '.png')

        g.user_datastore.create_user(first_name=user['first_name'],
                                     last_name=user['last_name'],
                                     email=user['email'],
                                     password=hash_password(user['password']),
                                     bio=user['bio'], roles=roles,
                                     avatar_name='identicon' + user['email'] + '.png',
                                     avatar=imgtext)
        if not user:
            add_self_action(user['email'], 'register')
        else:
            add_self_action(user['email'], 'invite', user_id=current_user['email'])
            add_self_action(current_user['email'], 'invitation', user_id=user['email'])
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
    """ Updates the User with 'email' in the passed json.

        Returns: 400 if user unknown, 403 if no permissions, 200 on success.
    """
    user = request.get_json()
    if not current_user_has_permission_to_change(user):
        raise ApiException("You don't have permission to edit this user", 403)

    res = g.user_datastore.get_user(user['email'])
    if not res:
        raise ApiException("Unknown User with Email-address: " + user['email'], 400)

    res.first_name = user.get('first_name', res.first_name)
    res.last_name = user.get('last_name', res.last_name)
    res.bio = user.get('bio', res.bio)

    if 'active' in user:
        if not current_user.has_role('admin'):
            raise ApiException("Users cannot de/activate themselves.", 403)
        if user.get('active') == 'false':
            for usr in g.user_datastore.user_model.objects:
                if usr.has_role('admin') and usr.active and usr['email'] != user['email']:
                    res.active = False
                    break
            else:
                raise ApiException("Can't deactivate the last admin.", 400)
        elif user.get('active') == 'true':
            res.active = True
        else:
            raise ApiException("user['active'] must be either 'true' or 'false", 400)

    if 'roles' in user:
        if 'admin' in user['roles'] and not current_user.has_role('admin'):
            raise ApiException("Current user has no permission to assign admin role.", 403)
        if 'admin' not in user['roles'] and res.has_role('admin'):
            for usr in g.user_datastore.user_model.objects:
                if usr.has_role('admin') and usr.active and usr['email'] != user['email']:
                    res.roles = [g.user_datastore.find_or_create_role(role)
                                 for role in user['roles']]
                    break
            else:
                raise ApiException("Can't unassign the admin role from the last admin.", 400)
        else:
            res.roles = [g.user_datastore.find_or_create_role(role) for role in user['roles']]

    res.save()

    return make_response("User with email: " + user['email'] + " updated", 200)


@users.route('/api/users/password', methods=['PUT'])
@login_required
def update_password():
    """ Method to update the password of the user with 'email' from the passed json.
        Supply new password as json['new_password'] and the old password with json['old_password']
        unless current user is an admin.

        Returns: 400 if user can't be found, 403 on false credentials or no permission,
                 200 on success.
    """
    user = request.get_json()
    res = g.user_datastore.get_user(user['email'])
    if not res:
        raise ApiException("Unknown User with Email-address: " +
                             user['email'], 400)

    if current_user.has_role('admin') or verify_password(user["old_password"], res.password):
        new_password = user["new_password"]
        res.password = hash_password(new_password)
        res.save()
        return make_response("Password restored!", 200)
    else:
        raise ApiException("You don't have permission to edit this user", 403)


@users.route('/api/users/<email:mail>', methods=['DELETE'])
@login_required
def delete_user(mail):
    """ Method to delete the user with <email>
        Returns: 403 if no permission, 404 if no user with <email> and 200 on success.
    """
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("user not found", 404)
    if not current_user_has_permission_to_change(user):
        raise ApiException("Permission denied!", 403)

    if not user.has_role('admin'):
        g.user_datastore.delete_user(user)
        delete_user_notification(user['email'])
        return make_response("deleted non admin", 200)
    else:
        for usr in g.user_datastore.user_model.objects:
            if usr.has_role('admin') and usr.active and usr['email'] != user['email']:
                delete_user_notification(user['email'])
                g.user_datastore.delete_user(user)
                return make_response("deleted", 200)
        raise ApiException("You are the last surviving admin, "
                           "you cannot delete yourself", 9001)


@users.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def get_user(mail):
    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
    """
    user = g.user_datastore.get_user(mail)
    if not user:
        raise ApiException("Unknown User with Email-address: " + str(mail), 404)

    res = user.to_dict()
    return jsonify(res)


@users.route('/api/users/<email:mail>/projects', methods=['GET'])
@login_required
def get_user_projects(mail):
    """Return projects of user

        Returns:
            res: Array with projects where the user is author
    """
    try:
        projects = g.projects.find({'authors': str(mail)})
        return jsonify(list(projects))
    except Exception as err:
        raise ApiException(str(err), 500)


@users.route('/api/users/<email:mail>/tags', methods=['GET'])
@login_required
def get_user_tags(mail):
    """Return top five tags of user

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
        toptags = taglist[0:5] if len(taglist) > 5 else taglist
        return jsonify(sorted([x['_id'] for x in toptags], key=str.lower))
    except Exception as err:
        raise ApiException(str(err), 500)
