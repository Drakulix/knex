"""Main Module of knex
Defines API points and starts the application
"""

import os
import sys
import time
import json
import json5

from elasticsearch import Elasticsearch
from elasticsearch.exceptions import RequestError
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from flask_login import LoginManager
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore, \
        UserMixin, RoleMixin, login_required, \
        roles_required, login_user, logout_user
from flask_security.utils import verify_password, encrypt_password
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient, ReturnDocument
from werkzeug.utils import secure_filename
from werkzeug.routing import BaseConverter
from mongoengine.fields import UUIDField, ListField, StringField, BooleanField
from bson.json_util import dumps

import uploader
from apiexception import ApiException


# Create app
app = Flask(__name__, static_url_path='')
CORS(app)

# MongoDB Config
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'super-secret'
app.config['MONGODB_DB'] = 'knexdb'
app.config['MONGODB_HOST'] = 'mongodb'
app.config['MONGODB_PORT'] = 27017
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'THISISMYOWNSALT'
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000  # 100.000 byte = 100kb
ALLOWED_EXTENSIONS = {'txt', 'json', 'json5'}

# Create login manager
login_manager = LoginManager()
login_manager.init_app(app)

# Inizialize globals
es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200}])
client = MongoClient('mongodb:27017')
coll = client.knexdb.projects
with app.open_resource("manifest_schema.json", mode='r') as schema_file:
    schema = json.load(schema_file)
validator = Draft4Validator(schema, format_checker=FormatChecker())

# Create database connection object
db = MongoEngine(app)


class Role(db.Document, RoleMixin):
    name = db.StringField(max_length=80, unique=True)
    description = db.StringField(max_length=255)


class User(db.Document, UserMixin):
    email = db.StringField(max_length=255)
    first_name = db.StringField(max_length=255)
    last_name = db.StringField(max_length=255)
    password = db.StringField(max_length=255)
    active = db.BooleanField(default=True)
    bio = db.StringField(max_length=255)
    bookmarks = db.ListField(UUIDField(), default=[])
    roles = db.ListField(db.ReferenceField(Role), default=[])


class EmailConverter(BaseConverter):
    regex = r"([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\." +\
            r"[a-z0-9!#$%&'*+\/=?^_`"r"{|}~-]+)" +\
            r"*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?" +\
            r"(\.|"r"\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"


# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)
app.url_map.converters['email'] = EmailConverter


# Flask URL methods
@app.route('/', methods=['GET'])
def index():
    """Index of knex
    """
    return app.send_static_file('index.html')


@app.before_first_request
def initialize_users():
    user_role = user_datastore.find_or_create_role('user')
    pw = encrypt_password("user")
    user_datastore.create_user(
        email='user@knex.com', password=pw, roles=[user_role])
    admin_role = user_datastore.find_or_create_role('admin')
    pw = encrypt_password("admin")
    user_datastore.create_user(
        email='admin@knex.com', password=pw, roles=[admin_role])


@app.route('/api/users/login', methods=['POST'])
def login():
    email = request.form['email']
    password = request.form['password']
    user = user_datastore.get_user(email)
    if user is None:
        return make_response("Username oder Password invalid", 500)

    if verify_password(password, user["password"]):
        login_user(user)
        return make_response('Login successful', 200)

    return make_response("Username oder Password invalid", 500)


@app.route('/api/users/logout')
def logout():
    logout_user()
    return make_response('Logged out', 200)


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


# @login_required
@app.route('/api/projects', methods=['POST'])
def add_project():
    """Receive manifest as a jsonstring and return new ID
    """
    successful_ids = []
    unsuccessful_files = []
    uploaded_files = request.files.getlist("file[]")
    if len(uploaded_files) is not 0:
        for file in uploaded_files:
            securefilename = secure_filename(file.filename)
            if file and uploader.allowed_file(securefilename):
                try:
                    newid = uploader.save_file_to_db(file, securefilename)
                    ids.append(newid)
                except ApiException as e:
                    unsuccessful_files.append(file.filename + str(e))

        return jsonify(successful_ids)

    else:
        try:
            return_ids = []
            if ('application/json' in request.content_type) and \
                    ('application/json5' not in request.content_type):
                return_ids = uploader.save_manifest_to_db(request.get_json())
            elif 'application/json5' in request.content_type:
                return_ids = uploader.save_manifest_to_db(
                    json5.loads(request.data.decode('utf-8')))
            else:
                raise ApiException("Wrong content header" +
                                   "and no files attached", 400)
            return jsonify(return_ids)

        except ApiException as e:
            raise e

        except UnicodeDecodeError as ue:
            raise ApiException("Only utf-8 compatible charsets are " +
                               "supported, the request body does not " +
                               "appear to be utf-8.", 400)
        except Exception as err:
            raise ApiException(str(err), 400)


@app.route('/api/projects', methods=['GET'])
def get_projects():
    """Return list of projects, args->limit, skip

    Returns:
        res: A list of projects
    """
    limit = request.args.get('limit', type=int)
    skip = request.args.get('skip', type=int)
    argc = len(request.args)

    if coll.count() == 0:
        return make_response("There are no projects", 500)

    if argc == 0:
        res = coll.find({})
    elif limit and skip and argc < 3:
        res = coll.find({}, limit=limit, skip=skip)
    elif limit and argc < 2:
        res = coll.find({}, limit=limit)
    elif skip and argc < 2:
        res = coll.find({}, skip=skip)
    else:
        return make_response('Invalid parameters', 400)

    res = make_response(jsonify([x for x in res[:]]))
    res.headers['Content-Type'] = 'application/json'
    return res


@app.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    """Returns project by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project corresponding to the ID
    """
    res = coll.find_one({'_id': project_id})
    if res is None:
        return make_response("Project not found", 404)
    return jsonify(res)


@app.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
# @roles_required('admin')
def delete_project(project_id):
    """Deletes a project by ID.

    Args:
        project_id: ID of a project

    Returns:
        response: Success response or 404 if project is not found
    """
    if coll.delete_one({'_id': project_id}).deleted_count == 0:
        return make_response("Project could not be found", 404)
    else:
        return make_response("Success")


@app.route('/api/projects/<uuid:project_id>', methods=['PUT'])
# @login_required
def update_project(project_id):
    """Updates Project by ID

    Args:
        project_id, updated manifest in json/json5 format

    Returns:
        response: Success response
                  or 404 if project is not found
                  or 409 if project_id differs from manifestID
                  or 500 in case of validation error
    """
    try:
        res = coll.find_one({'_id': project_id})
        if res is None:
            raise ApiException("Project not found", 404)
        elif request.is_json or "application/json5" in request.content_type:
            if request.is_json:
                manifest = request.get_json()
                if manifest['_id'] != str(project_id):
                    raise ApiException("Updated project owns different id",
                                       409)
            else:
                manifest = json5.loads(request.data.decode("utf-8"))
                if '_id' in manifest:
                    if manifest['_id'] != str(project_id):
                        raise ApiException("Updated project owns different id",
                                           409)
            is_valid = validator.is_valid(manifest)
            if is_valid:
                print("manifest validated", file=sys.stderr)
                manifest['_id'] = project_id
                manifest['date_last_updated'] = time.strftime("%Y-%m-%d")
                coll.find_one_and_replace({'_id': project_id}, manifest,
                                          return_document=ReturnDocument.AFTER)
                print("mongo replaced:", file=sys.stderr)
                print(manifest, file=sys.stderr)
                return make_response("Success")
            elif on_json_loading_failed() is not None:
                raise ApiException("json could not be parsed",
                                   400, on_json_loading_failed())
            else:
                validation_errs = [error for error in
                                   sorted(validator.iter_errors(manifest))]
                if validation_errs is not None:
                    raise ApiException("Validation Error: \n" +
                                       str(is_valid), 400, validation_errs)
        else:
            raise ApiException("Manifest had wrong format", 400)
    except ApiException as error:
        raise error
    except UnicodeDecodeError as unicodeerr:
        raise ApiException("Only utf-8 compatible charsets are supported, " +
                           "the request body does not appear to be utf-8", 400)
    except Exception as err:
        raise ApiException(str(err), 500)


@app.route('/api/projects/search', methods=['POST'])
def search():
    """Receive body of elasticsearch query

    Returns:
        res (json): Body of the Query
    """
    try:
        res = es.search(index="knexdb", body=request.get_json())
        return jsonify(res)
    except RequestError as e:
        return (str(e), 400)


@app.route('/api/projects/search/simple/', methods=['GET'])
def search_simple():
    """Search projects

    Returns:
        res (json): JSON containing Projects and metadata

    """
    text = request.args.get("q", type=str)
    sorting = request.args.get('sort', type=str)
    order = request.args.get('order', type=str)
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    # ^2 is boosting the attribute, *_is allowing wildcards to be used
    request_json = {
        'query': {
            'multi_match': {
                'query': text,
                'fields': [
                    'tags^2',
                    'title^2',
                    'description',
                ],
            },
        },
        'from': offset,
        'size': count,
    }
    if (sorting is not None) and (order is not None):
        request_json["sort"] = dict()
        request_json["sort"][sorting] = {
            'order': order,
        }

    try:
        res = es.search(index="knexdb", body=request_json)
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@app.route('/api/projects/search/advanced/', methods=['GET'])
def search_avanced():
    """Advanced search with filters

    Returns:
        res (json): JSON containing Projects and metadata

    """
    text = request.args.get("q", type=str)
    sorting = request.args.get('sort', type=str)
    order = request.args.get('order', type=str)
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    request_json = {
        'query': {
            'query_string': {
                'query': text,
            },
        },
        'from': offset,
        'size': count,
    }
    if (sorting is not None) and (order is not None):
        request_json["sort"] = dict()
        request_json["sort"][sorting] = {
            'order': order,
        }
    try:
        res = es.search(index="knexdb", body=request_json)
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@app.route('/api/projects/search/tag/', methods=['GET'])
def search_tag():
    """Search projects

    Returns:
        res (json): JSON containing Projects and metadata
    """
    tag = request.args.get('q', type=str)
    sorting = request.args.get('sort', type=str)
    order = request.args.get('order', type=str)
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    request_json = {
        'query': {
            'bool': {
                'must': [
                    {
                        'match_phrase': {
                            'tags': tag,
                        },
                    },
                ],
            },
        },
        'from': offset,
        'size': count,
    }
    if (sorting is not None) and (order is not None):
        request_json["sort"] = dict()
        request_json["sort"][sorting] = {
            'order': order,
        }
    try:
        res = es.search(index="knexdb", body=request_json)
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@app.route('/api/projects/search/suggest/', methods=['GET'])
def search_suggest():
    """Suggests search improvements

    Returns:
        res (json): JSON containing suggested search terms
    """
    text = request.args.get('q', type=str)

    request_json = {
        'suggest': {
            'text': text,
            'phraseSuggestion': {
                'phrase': {
                    'field': "description",
                    'highlight': {
                        'pre_tag': '<em>',
                        'post_tag': '</em>',
                    },
                    'direct_generator': [
                        {
                            'field': 'description',
                            'size': 10,
                            'suggest_mode': 'missing',
                            'min_word_length': 3,
                            'prefix_length': 2,
                        }
                    ],
                },
            },
        },
    }
    try:
        res = es.search(index="knexdb", body=request_json)
        return jsonify(res['suggest']['phraseSuggestion'][0]['options'])
    except RequestError as e:
        return (str(e), 400)


@app.route('/api/users', methods=['PUT'])
# @roles_required('admin')
def createUser():

    try:
        user = request.get_json()

        # still without json validation
        # a new user does not have bookmarks
        role = user_datastore.find_or_create_role(user['role'])
        # if res is not None:
        # return make_response('User already exists',500)

        user_datastore.create_user(first_name=user["first name"],
                                   last_name=user["last name"],
                                   email=user["email"],
                                   password=encrypt_password(user["password"]),
                                   bio=user["bio"], roles=[role])

        return jsonify(user_datastore.get_user(user['email']))

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)


@app.route('/api/users/', methods=['PUT'])
# @roles_required('admin')
def updateUser():
    user = request.get_json()

    res = user_datastore.get_user(user['email'])
    if res is None:
        return make_response("Unknown User with Email-address: " +
                             user['email'], 500)
    res.first_name = user['first name']
    res.last_name = user['last name']
    res.password = encrypt_password(user['password'])
    res.bio = user['bio']
    res.roles = []
    res.roles.append(user_datastore.find_or_create_role(user['role']))
    res.save()
    res = make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json'

    return make_response("User with email: " + user['email'] + " updated", 200)


@app.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def getUser(mail):

    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
    """
    res = user_datastore.get_user(mail)
    if res is None:
        return make_response("Unknown User with Email-address: " + mail, 500)

    return jsonify(res)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
