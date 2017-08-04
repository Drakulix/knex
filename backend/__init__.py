import os
import sys
import json
import time
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

from api.projects import projects
from api.users import users
from api.search import search, prepare_es_results
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

    def to_dict(self):
        dic = {}
        dic['id'] = str(self.notification_id)
        dic['title'] = str(self.title)
        dic['description'] = str(self.description)
        dic['link'] = str(self.link)
        return dic


class SavedSearch(EmbeddedDocument):
    saved_search_id = DB.ObjectIdField(default=ObjectId)
    metadata = DB.StringField()
    query = DB.StringField()
    count = DB.LongField()

    def to_dict(self):
        dic = {}
        dic['id'] = str(self.saved_search_id)
        dic['query'] = json.loads(str(self.metadata))
        dic['count'] = self.count
        return dic


class User(DB.Document, UserMixin):
    email = DB.StringField(max_length=255, unique=True)
    first_name = DB.StringField(max_length=255, default="")
    last_name = DB.StringField(max_length=255, default="")
    password = DB.StringField(max_length=255)
    active = DB.BooleanField(default=True)
    bio = DB.StringField(max_length=255)
    bookmarks = DB.ListField(DB.UUIDField(), default=[])
    roles = DB.ListField(DB.ReferenceField(Role), default=[])
    notifications = DB.ListField(DB.EmbeddedDocumentField(Notification), default=[])
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
        dic['bookmarks'] = [str(bookmark) for bookmark in self.bookmarks]
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


# internal function to append notifications to the given userlist
def notify_users(useremail_list, n_description, n_title, n_link):
    n = Notification(description=n_description, title=n_title, link=n_link)
    for email in useremail_list:
        user = USER_DATASTORE.get_user(email)
        if user and user['email'] != current_user['email']:
            for existing_n in user.notifications:
                if str(existing_n.link) == str(n_link):
                    break
            else:
                user.notifications.append(n)
                if len(user.notifications) > 20:
                    users.notifications.pop(0)
                user.save()
    return str(n.notification_id)


@app.before_request
def notification_func():
    g.notify_users = notify_users


def users_with_bookmark(id):
    return [user['email'] for user in User.objects if id in user.bookmarks]


@app.before_request
def users_with_bookmark_func():
    g.users_with_bookmark = users_with_bookmark


def save_search(user, meta, query, count):
    search = SavedSearch(metadata=json.dumps(meta), query=json.dumps(query), count=count)
    user.saved_searches.append(search)
    user.save()
    return str(search.saved_search_id)


@app.before_request
def save_search_func():
    g.save_search = save_search


def rerun_saved_searches():
    # This really is ugly but MongoConnector has to catch up for a valid count
    for user in User.objects:
        for search in user.saved_searches:
            projects = prepare_es_results(g.projects.find(search['query']))
            if search['count'] != len(projects):
                search['count'] = len(projects)
                search.save()
                notify_users([user['email']], 'Saved search changed',
                             str(search.title) + ' updated',
                             '/results/saved/' + str(search.saved_search_id))


@app.before_request
def rerun_saved_searches_func():
    g.rerun_saved_searches = rerun_saved_searches


def on_project_deletion():
    for user in User.objects:
        user.bookmarks = [x for x in user.bookmarks if g.projects.find_one({'_id': x})]
        user.notifications = [x for x in user.notifications if
                              '/project/' not in str(x.link) or g.projects.find_one(
                                  {'_id': uuid.UUID(
                                   str(x.link)[str(x.link).index('/project/') + len('/project/'):]
                                   )
                                   })]
        user.save()


@app.before_request
def project_deleted_func():
    g.on_project_deletion = on_project_deletion


@app.before_first_request
def initialize_users():
    user_role = USER_DATASTORE.find_or_create_role('user')
    admin_role = USER_DATASTORE.find_or_create_role('admin')
    adminpw = hash_password(config["administration_user"]["password"])
    try:
        with open(os.path.join(sys.path[0], "default_avatar.png"), 'rb') as tf:
            imgtext = base64.b64encode(tf.read()).decode()
        USER_DATASTORE.create_user(
            email=config["administration_user"]["email"], password=adminpw,
            first_name="default", last_name=config["administration_user"]["username"],
            bio="Lead developer proxy of knex.", roles=[user_role, admin_role],
            avatar_name="default_avatar.png", avatar=imgtext)

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
    app.run(host=config["flask"]["hostname"], port=config["flask"]["port"],
            debug=config["flask"]["debug"])
