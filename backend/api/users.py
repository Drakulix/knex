from flask import request, jsonify, make_response, current_app, g, Blueprint
from flask_security import login_required, roles_required, login_user,\
    logout_user, current_user
from flask_security.utils import verify_password, encrypt_password
from bson.json_util import dumps
from api.helper.apiexception import ApiException
from api.helper.userpermission import is_permitted

users = Blueprint('api_users', __name__)


@users.route('/api/users/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    user = g.user_datastore.get_user(email)
    if user is None:
        return make_response("Username oder Password invalid", 403)

    if verify_password(password, user["password"]):
        login_user(user)
        return make_response("Login successful", 200)

    return make_response("Username oder Password invalid", 403)


@users.route('/api/users/logout')
def logout():
    logout_user()
    return make_response("Logged out", 200)


@users.route('/api/users', methods=['POST'])
@roles_required('admin')
def create_user():
    try:
        user = request.get_json()

        # still without json validation
        # a new user does not have bookmarks
        role = g.user_datastore.find_or_create_role(user['role'])
        # if res is not None:
        # return make_response('User already exists',500)

        g.user_datastore.create_user(first_name=user['first name'],
                                     last_name=user['last name'],
                                     email=user['email'],
                                     password=encrypt_password(
                                         user['password']),
                                     bio=user['bio'],
                                     roles=[role])

        return jsonify(g.user_datastore.get_user(user['email']))

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)


@users.route('/api/users', methods=['PUT'])
@login_required
def update_user():
    editor = current_user
    user = request.get_json()
    is_same_user = editor['email'] == user['email']
    if(is_permitted(editor["roles"]) is True or is_same_user is True):
        res = g.user_datastore.get_user(user['email'])
        if res is None:
            return make_response("Unknown User with Email-address: " +
                                 user['email'], 400)
        res.first_name = user['first name']
        res.last_name = user['last name']
        res.bio = user['bio']
        res.save()
        res = make_response(dumps(res))
        res.headers['Content-Type'] = 'application/json'

        return make_response("User with email: " +
                             user['email'] + " updated", 200)

    return make_response("You don't have the permissions " +
                         "to edit this user", 400)


@users.route('/api/users/password', methods=['PUT'])
@login_required
def update_password():
    editor = current_user
    user = request.get_json()
    if(is_permitted(editor["roles"]) is True):
        res = g.user_datastore.get_user(user['email'])
        if res is None:
            return make_response("Unknown User with Email-address: " +
                                 user['email'], 404)
        new_password = user["new password"]
        res.password = encrypt_password(new_password)
        res.save()
        return make_response("Password restored!", 200)

    elif (editor["email"] == user['email']):
        res = g.user_datastore.get_user(user['email'])
        if res is None:
            return make_response("Unknown User with Email-address: " +
                                 user['email'], 404)
        old_password = user["old password"]
        if verify_password(old_password, res.password):
            new_password = user["new password"]
            if new_password == old_password:
                return make_response("The old and new passwords" +
                                     "can not be the same", 200)
            res.password = encrypt_password(new_password)
            res.save()
            return make_response("Password updated!", 200)
        return make_response("Old and new password does not match", 400)

    return make_response("You don't have the permissions " +
                         "to edit this user", 400)

@users.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def get_user(mail):
    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
    """
    res = g.user_datastore.get_user(mail)
    if res is None:
        return make_response("Unknown User with Email-address: " + mail, 400)

    return jsonify(res)


@users.route('/api/users/bookmarks/<uuid:id>', methods=['POST'])
@login_required
def insert_bookmarks(id):
    user = current_user
    res = g.user_datastore.get_user(user['email'])
    if res is None:
        return make_response("Unknown User with Email-address: ", 400)

    if id in res.bookmarks:
        return make_response("Project is already bookmarked ", 400)
    res.bookmarks.append(id)
    res.save()
    return jsonify(res['bookmarks'])


@users.route('/api/users/bookmarks/<uuid:id>', methods=['DELETE'])
@login_required
def delete_bookmarks(id):
    user = current_user
    if user is None:
        return make_response("No current user detected ", 400)
    res = g.user_datastore.get_user(user.email)
    if res is None:
        return make_response("Unknown User with Email-address: " +
                             user.email, 400)

    if id in res.bookmarks:
        res.bookmarks.remove(id)
        res.save()
        return jsonify(res['bookmarks'])
    return make_response("Project is not bookmarked: ", 400)


@users.route('/api/users/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    user = current_user
    if user is None:
        return make_response("No current user detected ", 400)
    res = g.user_datastore.get_user(user.email)
    if res is None:
        return make_response("Unknown User with Email-address: " +
                             user.email, 400)
    return jsonify(res['bookmarks'])
