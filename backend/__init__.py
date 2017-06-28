import json

from elasticsearch import Elasticsearch
from flask import Flask, g, jsonify
from flask_cors import CORS
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore, UserMixin, RoleMixin, current_user
from flask_security.utils import encrypt_password
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient, ReturnDocument
from mongoengine.fields import UUIDField, ListField, StringField, BooleanField
from werkzeug.routing import BaseConverter

from api.projects import projects
from api.users import users
from api.search import search
from api.helper.apiexception import ApiException

app = Flask(__name__, static_url_path='')
CORS(app)

app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'super-secret'
app.config['MONGODB_DB'] = 'knexdb'
app.config['MONGODB_HOST'] = 'mongodb'
app.config['MONGODB_PORT'] = 27017
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'THISISMYOWNSALT'
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000  # 100.000 byte = 100kb

global DB
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


@app.before_first_request
def init_global_manifest_validator():
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


class User(DB.Document, UserMixin):
    email = DB.StringField(max_length=255)
    first_name = DB.StringField(max_length=255)
    last_name = DB.StringField(max_length=255)
    password = DB.StringField(max_length=255)
    active = DB.BooleanField(default=True)
    bio = DB.StringField(max_length=255)
    bookmarks = DB.ListField(UUIDField(), default=[])
    roles = DB.ListField(DB.ReferenceField(Role), default=[])


class EmailConverter(BaseConverter):
    regex = r"([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\." +\
            r"[a-z0-9!#$%&'*+\/=?^_`"r"{|}~-]+)" +\
            r"*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" +\
            r"(\.|"r"\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"


app.url_map.converters['email'] = EmailConverter

global USER_DATASTORE
global SECURITY

USER_DATASTORE = MongoEngineUserDatastore(DB, User, Role)
SECURITY = Security(app, USER_DATASTORE)


@app.before_first_request
def initialize_users():
    user_role = USER_DATASTORE.find_or_create_role('user')
    pw = encrypt_password("user")
    USER_DATASTORE.create_user(
        email='user@knex.com', password=pw, roles=[user_role])
    admin_role = USER_DATASTORE.find_or_create_role('admin')
    pw = encrypt_password("admin")
    USER_DATASTORE.create_user(
        email='admin@knex.com', password=pw, roles=[admin_role])


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


@app.route('/', methods=['GET'])
def index():
    """Index of knex
    """
    return app.send_static_file('index.html')


app.register_blueprint(projects)
app.register_blueprint(users)
app.register_blueprint(search)


@app.route('/<path:dummy>', methods=['GET'])
def index_dummy():
    """Index of knex
    """
    return app.send_static_file('index.html')


if __name__ == "__main__":
    # remove debug for production
    app.run(host="0.0.0.0", port=5000, debug=True)
