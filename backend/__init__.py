from elasticsearch import Elasticsearch
from flask import Flask, g, jsonify, request
from flask.helpers import make_response
from flask_cors import CORS
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore, UserMixin, RoleMixin
from flask_security.utils import encrypt_password
from flask_principal import PermissionDenied
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient, ReturnDocument
from mongoengine.fields import (UUIDField, ListField, StringField, BooleanField,
                                ObjectId, EmbeddedDocumentField, EmbeddedDocument,
                                ListField, ObjectIdField)
from werkzeug.routing import BaseConverter

from api.projects import projects
from api.users import users
from api.search import search
from api.helper.apiexception import ApiException
from globals import ADMIN_PERMISSION


app = Flask(__name__, static_url_path='')
CORS(app)

app.config['DEBUG'] = True
app.config['TESTING'] = False
app.config['SECRET_KEY'] = 'super-secret'
app.config['MONGODB_DB'] = 'knexdb'
app.config['MONGODB_HOST'] = 'mongodb'
app.config['MONGODB_PORT'] = 27017
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'THISISMYOWNSALT'
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000  # 100.000 byte = 100kb

DB = MongoEngine(app)

LOGINMANAGER = LoginManager()
LOGINMANAGER.init_app(app)


@app.before_first_request
def init_global_elasticsearch():
    global ES
    ES = Elasticsearch([{'host': 'elasticsearch', 'port': 9200}])
    ES.indices.create(index='knexdb', ignore=400)


@app.before_request
def set_global_elasticsearch():
    g.es = ES


@app.before_first_request
def init_global_mongoclient():
    global MONGOCLIENT
    MONGOCLIENT = MongoClient('mongodb:27017')


@app.before_request
def set_global_mongoclient():
    g.knexdb = MONGOCLIENT.knexdb
    g.projects = g.knexdb.projects


@LOGINMANAGER.user_loader
def load_user(user_id):
    return User.get(user_id)


@LOGINMANAGER.unauthorized_handler
def handle_unauthorized_access():
    return make_response("Forbidden", 403)


@app.before_first_request
def init_global_manifest_validator():
    import json
    with app.open_resource("manifest_schema.json", mode='r') as schema_file:
        schema = json.load(schema_file)
        global VALIDATOR
        VALIDATOR = Draft4Validator(schema, format_checker=FormatChecker())


@app.before_request
def set_global_manifest_validator():
    g.validator = VALIDATOR


@app.before_request
def set_global_mongo_engine():
    g.user_datastore = USER_DATASTORE


class Role(DB.Document, RoleMixin):
    name = DB.StringField(max_length=80, unique=True)
    description = DB.StringField(max_length=255)


class Notification(DB.EmbeddedDocument):
    notification_id = DB.ObjectIdField(default=ObjectId)
    title = DB.StringField(max_length=255)
    description = DB.StringField(max_length=255)
    link = DB.StringField(max_length=255)


class User(DB.Document, UserMixin):
    email = DB.StringField(max_length=255, unique=True)
    first_name = DB.StringField(max_length=255)
    last_name = DB.StringField(max_length=255)
    password = DB.StringField(max_length=255)
    active = DB.BooleanField(default=True)
    bio = DB.StringField(max_length=255)
    bookmarks = DB.ListField(DB.UUIDField(), default=[])
    roles = DB.ListField(DB.ReferenceField(Role), default=[])
    notifications = DB.ListField(DB.EmbeddedDocumentField(Notification), default=[])

    # we must not override the method __iter__ because Document.save() stops working then
    def to_dict(self):
        dic = {}
        dic['email'] = str(self.email)
        dic['first_name'] = str(self.first_name)
        dic['last_name'] = str(self.last_name)
        # dic['password'] = str(self.password)
        dic['active'] = str(self.active)
        dic['bio'] = str(self.bio)
        dic['bookmarks'] = [str(bookmark) for bookmark in self.bookmarks]
        dic['roles'] = [str(role) for role in self.roles]
        return dic


class EmailConverter(BaseConverter):
    regex = r"([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\." +\
            r"[a-z0-9!#$%&'*+\/=?^_`"r"{|}~-]+)" +\
            r"*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" +\
            r"(\.|"r"\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"


app.url_map.converters['email'] = EmailConverter

USER_DATASTORE = MongoEngineUserDatastore(DB, User, Role)
SECURITY = Security(app, USER_DATASTORE)


# internal function to append notifications to the given userlist
def notify_users(useremail_list, n_description, n_title, n_link):
    n = Notification(description=n_description, title=n_title, link=n_link)
    for email in useremail_list:
        user = USER_DATASTORE.get_user(email)
        id = None
        if user:
            user.notifications.append(n)
            if len(user.notifications) > 20:
                users.notifications.pop(0)
            user.save()
    return str(n.notification_id)


@app.before_request
def notification_func():
    g.notify_users = notify_users


@app.before_first_request
def initialize_users():
    user_role = USER_DATASTORE.find_or_create_role('user')
    admin_role = USER_DATASTORE.find_or_create_role('admin')
    userpw = encrypt_password("user")
    adminpw = encrypt_password("admin")
    try:
        if not USER_DATASTORE.get_user('user@knex.com'):
            USER_DATASTORE.create_user(
                email='user@knex.com', password=userpw, roles=[user_role])
    # user_datastore.get_user might return None or throw an exception if the user does not exist
    except Exception:
        USER_DATASTORE.create_user(
                email='user@knex.com', password=userpw, roles=[user_role])
    try:
        if not USER_DATASTORE.get_user('admin@knex.com'):
            USER_DATASTORE.create_user(
                email='admin@knex.com', password=adminpw, roles=[user_role, admin_role])
    # user_datastore.get_user might return None or throw an exception if the user does not exist
    except Exception:
        USER_DATASTORE.create_user(
                email='admin@knex.com', password=adminpw, roles=[user_role, admin_role])


@app.errorhandler(ApiException)
def handle_invalid_usage(error):
    """Handler for the ApiException error class.

    Args:
        error: Error which needs to be handled.

    Returns:
        response (json): Error in json format
    """
    response = jsonify(error.to_dict())
    response.status_code = error.status_code
    return response


@app.errorhandler(PermissionDenied)
def handle_insufficient_permission(error):
    """ Handler for insufficient permission to access a method.
        This is not the error handler for insufficient permission to update
        a project or user.
    """
    return make_response("Not found", 404)


@app.errorhandler(404)
def index(err):
    """Index of knex
    """
    if request.path.startswith("/api/"):
        return err, 404
    return app.send_static_file('index.html')


@app.route('/', methods=['GET'])
def index():
    """Index of knex
    """
    return app.send_static_file('index.html')


app.register_blueprint(projects)
app.register_blueprint(users)
app.register_blueprint(search)


if __name__ == "__main__":
    # remove debug for production
    app.run(host="0.0.0.0", port=5000, debug=True)
