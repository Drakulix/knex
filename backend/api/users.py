from flask import request, jsonify, make_response, current_app, g, Blueprint
from flask_security import login_required, roles_required, login_user, logout_user
from flask_security.utils import verify_password, encrypt_password

from api.helper.apiexception import ApiException

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
        return make_response('Login successful', 200)

    return make_response("Username oder Password invalid", 403)


@users.route('/api/users/logout')
def logout():
    logout_user()
    return make_response('Logged out', 200)


@users.route('/api/users', methods=['PUT'])
# @roles_required('admin')
def create_user():

    try:
        user = request.get_json()

        # still without json validation
        # a new user does not have bookmarks
        role = g.user_datastore.find_or_create_role(user['role'])
        # if res is not None:
        # return make_response('User already exists',500)

        g.user_datastore.create_user(first_name=user["first name"],
                                     last_name=user["last name"],
                                     email=user["email"],
                                     password=encrypt_password(user["password"]),
                                     bio=user["bio"], roles=[role])

        return jsonify(g.user_datastore.get_user(user['email']))

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)


@users.route('/api/users/', methods=['PUT'])
# @roles_required('admin')
def update_user():
    user = request.get_json()

    res = g.user_datastore.get_user(user['email'])
    if res is None:
        return make_response("Unknown User with Email-address: " +
                             user['email'], 500)
    res.first_name = user['first name']
    res.last_name = user['last name']
    res.password = encrypt_password(user['password'])
    res.bio = user['bio']
    res.roles = []
    res.roles.append(g.user_datastore.find_or_create_role(user['role']))
    res.save()
    res = make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json'

    return make_response("User with email: " + user['email'] + " updated", 200)


@users.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def get_user(mail):
    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
    """
    res = g.user_datastore.get_user(mail)
    if res is None:
        return make_response("Unknown User with Email-address: " + mail, 404)

    return jsonify(res)