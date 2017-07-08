from flask import request, jsonify, make_response, g, Blueprint
from flask_security import login_required, login_user, logout_user, current_user
from flask_security.utils import verify_password, encrypt_password

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


@users.route('/api/users', methods=['POST'])
def create_user():
    try:
        user = request.get_json()

        if user['roles'] == 'admin':
            if current_user.has_role('admin'):
                pass
            else:
                raise ApiException('Cannot create admin user', 403)

        # still without json validation
        # a new user does not have bookmarks
        roles = g.user_datastore.find_or_create_role(user['roles'])
        # if res is not None:
        # return make_response('User already exists',500)

        g.user_datastore.create_user(first_name=user['first name'],
                                     last_name=user['last name'],
                                     email=user['email'],
                                     password=encrypt_password(
                                         user['password']),
                                     bio=user['bio'],
                                     roles=[roles])

        return jsonify(g.user_datastore.get_user(user['email']))

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
            return make_response("Unknown User with Email-address: " +
                                 user['email'], 400)
        res.first_name = user['first name']
        res.last_name = user['last name']
        res.bio = user['bio']
        res.save()
        res = make_response(jsonify(res))
        res.headers['Content-Type'] = 'application/json'

        return make_response("User with email: " +
                             user['email'] + " updated", 200)

    return make_response("You don't have permission " +
                         "to edit this user", 400)


@users.route('/api/users/password', methods=['PUT'])
@login_required
def update_password():
    user = request.get_json()
    res = g.user_datastore.get_user(user['email'])
    if not res:
        return make_response("Unknown User with Email-address: " +
                             user['email'], 404)

    if current_user.has_role('admin') or verify_password(user["old_password"], res.password):
        new_password = user["new password"]
        res.password = encrypt_password(new_password)
        res.save()
        return make_response("Password restored!", 200)

    return make_response("You don't have permission to edit this user", 400)


@users.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def get_user(mail):
    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
    """
    user = g.user_datastore.get_user(mail)
    if not user:
        return make_response("Unknown User with Email-address: " + mail, 400)

    roles = [role for role in ['admin', 'user'] and user.has_role(role)]

    res = dict(user)
    del res['roles']
    del res['password']
    res['roles'] = roles

    return jsonify(res)


@users.route('/api/users/bookmarks/<uuid:id>', methods=['POST'])
@login_required
def insert_bookmarks(bookmarkid):
    user = current_user
    res = g.user_datastore.get_user(user['email'])
    if not res:
        return make_response("Unknown User with Email-address: ", 400)

    if bookmarkid in res.bookmarks:
        return make_response("Project is already bookmarked ", 400)
    res.bookmarks.append(bookmarkid)
    res.save()
    return jsonify(res['bookmarks'])


@users.route('/api/users/bookmarks/<uuid:id>', methods=['DELETE'])
@login_required
def delete_bookmarks(bookmarkid):
    res = g.user_datastore.get_user(current_user['email'])
    if bookmarkid in res.bookmarks:
        res.bookmarks.remove(bookmarkid)
        res.save()
        return jsonify(res['bookmarks'])
    return make_response("Project is not bookmarked: " + id, 400)


@users.route('/api/users/bookmarks', methods=['GET'])
@login_required
def get_bookmarks():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    return jsonify(user['bookmarks'])
