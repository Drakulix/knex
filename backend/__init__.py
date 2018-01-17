import os
import sys
import json
import uuid
import base64

import yaml
from flask import Flask, g, jsonify, request
from flask.helpers import make_response
from flask_cors import CORS
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore, UserMixin, RoleMixin, current_user
from flask_security.utils import hash_password
from flask_principal import PermissionDenied
from jsonschema import FormatChecker, Draft4Validator
from mongoengine import NotUniqueError
from pymongo import MongoClient, ReturnDocument
from mongoengine.fields import (UUIDField, ListField, StringField, BooleanField,
                                ObjectId, EmbeddedDocumentField, EmbeddedDocument,
                                ObjectIdField)
from werkzeug.routing import BaseConverter

from whoosh.fields import Schema, ID, KEYWORD, TEXT, NGRAMWORDS
from whoosh.index import create_in
from whoosh.analysis import FancyAnalyzer


from api.projects import projects
from api.users import users
from api.comments import comments
from api.bookmarks import bookmarks
from api.avatars import avatars
from api.share import share
from api.projectsInfo import projects_info
from api.projectsMeta import projects_meta
from api.notifications import notifications
from api.search import search, prepare_mongo_query
from api.helper.images import Identicon
from api.helper.apiexception import ApiException


config_file_path = os.path.dirname(os.path.abspath(__file__))
config = {}
default_config = {
    "flask": {
        "hostname": "0.0.0.0",
        "port": 5000,
        "debug": False
    },
    "mongo_db": {
        "secret_key": "super-secret",
        "hostname": "mongodb",
        "port": 27017,
        "security_password_hash": 'pbkdf2_sha512',
        "security_password_salt": 'THISISMYOWNSALT'
    },
    "administration_user": {
        "username": "admin",
        "password": "admin",
        "email": "admin@knex.com"
    }
}

if os.path.isfile(os.path.join(config_file_path, "config.yml")):
    print("Starting flask server (Backend/Api) using config file")
    with open(os.path.join(config_file_path, "config.yml"), 'r') as config_file:
        config = yaml.load(config_file)
        if "flask" in config:
            default_config["flask"].update(config["flask"])
        if "mongo_db" in config:
            default_config["mongo_db"].update(config["mongo_db"])
        if "administration_user" in config:
            default_config["administration_user"].update(config["administration_user"])

config = default_config

app = Flask(__name__, static_url_path='')
CORS(app)

app.config['DEBUG'] = True
app.config['TESTING'] = True
app.config['SECRET_KEY'] = config["mongo_db"]["secret_key"]
app.config['MONGODB_DB'] = "knexdb"
app.config['MONGODB_HOST'] = config["mongo_db"]["hostname"]
app.config['MONGODB_PORT'] = config["mongo_db"]["port"]
app.config['SECURITY_PASSWORD_HASH'] = config["mongo_db"]["security_password_hash"]
app.config['SECURITY_PASSWORD_SALT'] = config["mongo_db"]["security_password_salt"]
app.config['MAX_CONTENT_PATH'] = 1000000  # 1.000.000 byte = 1mb

DB = MongoEngine(app)


@app.before_first_request
def init_global_mongoclient():
    global MONGOCLIENT
    mongo_address = config["mongo_db"]["hostname"] + ":" + str(config["mongo_db"]["port"])
    MONGOCLIENT = MongoClient(mongo_address)


@app.before_request
def set_global_mongoclient():
    g.knexdb = MONGOCLIENT.knexdb
    g.projects = g.knexdb.projects
    g.notifications = g.knexdb.notifications
    g.projects_meta = g.knexdb.projects_meta


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


@app.before_request
def init_global_mongoclient():
    global WHOOSH
    if not os.path.exists("index"):
        os.mkdir("index")
    index = create_in("index", schema)
    g.whoosh_index = index


schema = Schema(
    ngrams=NGRAMWORDS(minsize=2,
                      maxsize=10,
                      stored=True,
                      field_boost=1.0,
                      tokenizer=FancyAnalyzer(),
                      at='start',
                      queryor=False,
                      sortable=False),
    content=TEXT(stored=True),
    spelling=TEXT(stored=True,
                  analyzer=FancyAnalyzer(),
                  spelling=True),
    id=ID(stored=True, unique=True))


class Role(DB.Document, RoleMixin):
    name = DB.StringField(max_length=80, unique=True)
    description = DB.StringField(max_length=255)


class SavedSearch(EmbeddedDocument):
    saved_search_id = DB.ObjectIdField(default=ObjectId)
    metadata = DB.StringField()
    count = DB.LongField()

    def to_dict(self):
        dic = {}
        dic['id'] = str(self.saved_search_id)
        dic['metadata'] = json.loads(str(self.metadata))
        dic['count'] = self.count
        return dic


class User(DB.Document, UserMixin):
    email = DB.StringField(max_length=255, unique=True)
    first_name = DB.StringField(max_length=255, default="")
    last_name = DB.StringField(max_length=255, default="")
    password = DB.StringField(max_length=255)
    active = DB.BooleanField(default=True)
    bio = DB.StringField(max_length=255)
    notifications_settings = DB.DictField()
    bookmarks = DB.ListField(DB.UUIDField(), default=[])
    roles = DB.ListField(DB.ReferenceField(Role), default=[])
    saved_searches = DB.ListField(DB.EmbeddedDocumentField(SavedSearch), default=[])
    avatar_name = DB.StringField(max_length=255)
    avatar = DB.StringField()  # this is ugly as fuck but we store b64 encoded file data

    # we must not override the method __iter__ because Document.save() stops working then
    def to_dict(self):
        dic = {}
        dic['email'] = str(self.email)
        dic['first_name'] = str(self.first_name)
        dic['last_name'] = str(self.last_name)
        # dic['password'] = str(self.password)
        dic['active'] = str(self.active).lower()
        dic['bio'] = str(self.bio)
#        dic['notifications_settings'] = dict(self.notifications_settings)
#        dic['bookmarks'] = [str(bookmark) for bookmark in self.bookmarks]
        dic['roles'] = [str(role.name) for role in self.roles]
        return dic


class EmailConverter(BaseConverter):
    regex = r"([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\." +\
            r"[a-z0-9!#$%&'*+\/=?^_`"r"{|}~-]+)" +\
            r"*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" +\
            r"(\.|"r"\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"


app.url_map.converters['email'] = EmailConverter

USER_DATASTORE = MongoEngineUserDatastore(DB, User, Role)
SECURITY = Security(app, USER_DATASTORE)


@SECURITY.login_manager.unauthorized_handler
def handle_unauthorized_access():
    return make_response("Forbidden", 403)


def users_with_bookmark(id):
    return [user['email'] for user in User.objects if id in user.bookmarks]


@app.before_request
def users_with_bookmark_func():
    g.users_with_bookmark = users_with_bookmark


def save_search(user, meta, count):
    search = SavedSearch(metadata=json.dumps(meta), count=count)
    user.saved_searches.append(search)
    user.save()
    return str(search.saved_search_id)


@app.before_request
def save_search_func():
    g.save_search = save_search


@app.before_first_request
def initialize_users():
    user_role = USER_DATASTORE.find_or_create_role('user')
    admin_role = USER_DATASTORE.find_or_create_role('admin')
    adminpw = hash_password(config["administration_user"]["password"])
    admin_mail = config["administration_user"]["email"]
    try:
        image = Identicon(admin_mail)
        result = image.generate()
        with open(os.path.join(sys.path[0], 'identicon' + admin_mail + '.png'), 'rb') as tf:
            imgtext = base64.b64encode(tf.read())
            os.remove(sys.path[0] + '/identicon' + admin_mail + '.png')
        USER_DATASTORE.create_user(
            email=admin_mail, password=adminpw,
            first_name="default", last_name=config["administration_user"]["username"],
            bio="Lead developer proxy of knex.", roles=[user_role, admin_role],
            avatar_name='identicon' + admin_mail + '.png', avatar=imgtext)

    except NotUniqueError:
        pass


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
        a project or user. It delivers a 404 as users should not see endpoints,
        where they don't have permissions to.
    """
    return make_response("Not found", 404)


@app.errorhandler(404)
def index(err):
    """Index of knex
    """
#    if request.path.startswith("/api/"):
    return err, 404
#    return app.send_static_file('index.html')


@app.route('/', methods=['GET'])
def index():
    """Index of knex
    """
    raise ApiException("Not found", 404)


app.register_blueprint(projects)
app.register_blueprint(users)
app.register_blueprint(search)
app.register_blueprint(comments)
app.register_blueprint(bookmarks)
app.register_blueprint(avatars)
app.register_blueprint(notifications)
app.register_blueprint(share)
app.register_blueprint(projects_info)
app.register_blueprint(projects_meta)


if __name__ == "__main__":
    # remove debug for production
    app.run(host=config["flask"]["hostname"], port=config["flask"]["port"],
            debug=config["flask"]["debug"])
