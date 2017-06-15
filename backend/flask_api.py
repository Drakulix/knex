import json
import os
import sys
import json5

from flask_login import  LoginManager
from bson.json_util import dumps
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import RequestError
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient
from werkzeug.utils import secure_filename
from werkzeug.routing import BaseConverter
from mongoengine.fields import UUIDField
import uploader
from apiexception import ApiException
from flask_mongoengine import MongoEngine
from flask_security import Security, MongoEngineUserDatastore, \
    UserMixin, RoleMixin, login_required, roles_required, login_user, logout_user
from flask_security.utils import verify_password,encrypt_password

es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200}])

client = MongoClient('mongodb:27017')
db = client.knexDB
coll = db.projects
app = Flask(__name__)


CORS(app)






with app.open_resource("manifest_schema.json") as schema_file:
    schema = json.load(schema_file)
validator = Draft4Validator(schema, format_checker=FormatChecker())

ALLOWED_EXTENSIONS = {'txt', 'json', 'json5'}
app.config['UPLOAD_FOLDER'] = ''
app.config['MAX_CONTENT_PATH'] = 1000000  # 100.000 byte = 100kb


@app.route('/', methods=['GET'])
def index():
    """Index of knex
    """
    return make_response('', 404)



# Create app
app = Flask(__name__)
app.config['DEBUG'] = True
app.config['SECRET_KEY'] = 'super-secret'

login_manager = LoginManager()
login_manager.init_app(app)

# MongoDB Config
app.config['MONGODB_DB'] = 'knexDB'
app.config['MONGODB_HOST'] = 'mongodb'
app.config['MONGODB_PORT'] = 27017
app.config['SECURITY_PASSWORD_HASH'] = 'pbkdf2_sha512'
app.config['SECURITY_PASSWORD_SALT'] = 'THISISMYOWNSALT'
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
    regex = r"([a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`""{|}~-]+)*(@|\sat\s)(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(\.|""\sdot\s))+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)"


# Setup Flask-Security
user_datastore = MongoEngineUserDatastore(db, User, Role)
security = Security(app, user_datastore)
app.url_map.converters['email'] = EmailConverter

@app.before_first_request
def initialize_users():
    user_role = user_datastore.find_or_create_role('user')
    user_datastore.create_user(email='user@knex.com', password=encrypt_password("user"), roles=[user_role])
    admin_role = user_datastore.find_or_create_role('admin')
    user_datastore.create_user(email='admin@knex.com', password=encrypt_password("admin"), roles=[admin_role])



#GET is only for testing!!
@app.route('/api/users/login', methods=['GET','POST'])
def login():
    if request.method == 'GET':
        return '''
                   <form action='login' method='POST'>
                    <input type='text' name='email' id='email' placeholder='email'></input>
                    <input type='password' name='password' id='password' placeholder='password'></input>
                    <input type='submit' name='submit'></input>
                   </form>
                   '''

    email = request.form['email']
    password = request.form['password']
    user = user_datastore.get_user(email)
    if user is None:
        return 'Username oder Password invalid'


    if verify_password(password, user["password"]):
        login_user(user)
        return "Login successful"

    return 'Username oder Password invalid'


@app.route('/api/users/logout')
def logout():
    logout_user()
    return 'Logged out'





@app.route('/api/projects', methods=['POST'])
def add_project():
    """Receive manifest as a jsonstring and return new ID
    """
    successful_files = []
    unsuccessful_files = []
    uploaded_files = request.files.getlist("file[]")
    if len(uploaded_files) is not 0:
        for file in uploaded_files:
            securefilename = secure_filename(file.filename)
            if file and uploader.allowed_file(securefilename):
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], securefilename))
                try:
                    newId = uploader.save_file_to_db(securefilename)
                    # represent original filename
                    successful_files.append(file.filename + " " + str(newId))
                except Exception as e:
                    unsuccessful_files.append(file.filename + str(e))

                print("Successful files: ", successful_files, '\n', file=sys.stderr)
                print("Unsuccessful files: ", unsuccessful_files, '\n', file=sys.stderr)
        return """<!doctype html>
                    <title>Upload multiple files</title>
                    <h1>Upload multiple files</h1>
                    <body>Successful files: """ + ', '.join(e for e in successful_files) + '<br />' + """
                    Unsuccessful files: """ + ', '.join(e for e in unsuccessful_files) + """
                    </body>"""

    else:  # no files attached
        try:
            return_ids = []
            if request.json:
                return_ids = uploader.save_manifest_to_db(request.json)

            else:
                print(request.data.decode("utf-8"), file=sys.stderr)
                return_ids = uploader.save_manifest_to_db(
                    json5.loads(request.data.decode("utf-8")))
                print(return_ids)

            return jsonify(return_ids)
        except ApiException as e:
            raise e
        except Exception as err:
            return make_response("error: " + str(err), '500')


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


@app.route('/upload', methods=['GET'])
def uploads():
    """TODO:
    remove this later, default multi file uploader for testing purposes
    """
    if request.method == 'GET':
        return """<!doctype html>
        <title>Upload multiple files</title>
        <h1>Upload multiple files</h1>
        <form action="" method=post enctype=multipart/form-data>
        <input type=file name="file[]" multiple>
        <input type=submit value=Upload>
        </form>"""


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
        return make_response('There are no projects', 500)

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

    res = make_response(dumps(res))
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
        return make_response('Project not found', 404)
    return jsonify(res)


@app.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Deletes a project by ID.

    Args:
        project_id: ID of a project

    Returns:
        response: Success response or 404 if project is not found
    """
    try:
        es.delete(index="projects-index", doc_type='Project', id=project_id, refresh=True)
    except Exception as e:
        if coll.delete_one({'_id': project_id}).deleted_count == 0:
            return make_response('Project not found', 404)
        else:
            return make_response('Success')
    else:
        coll.delete_one({'_id': project_id})
        return make_response('Success')


@app.route('/api/projects/search', methods=['POST'])
def search():
    """Receive body of elasticsearch query

    Returns:
        res (json): Body of the Query
    """
    try:
        res = es.search(index="projects-index", doc_type="Project", body=request.json)
        return jsonify(res)
    except RequestError as e:
        return (str(e), 400)



@app.route('/api/users', methods=['PUT'])
@roles_required('admin')
def createUser():

    try:
        user = request.get_json()

        # still without json validation
        # a new user does not have bookmarks
        
        role = user_datastore.find_or_create_role(user['role'])
        res = coll_user.find({'email' : user["email"]})
        #if res is not None:
        #    return make_response('User already exists',500)

        user_datastore.create_user(first_name = user["first name"],last_name = user["last name"],
                                   email = user["email"],password = encrypt_password(user["password"]), bio = user["bio"],roles=[role])

        return jsonify(user_datastore.get_user(user['email']))

    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)





@app.route('/api/users/', methods=['PUT'])
@roles_required('admin')
def updateUser():
    user = request.get_json()

    res = user_datastore.get_user(user['email'])
    if res is None:
        return make_response('Unknown User with Email-address: ' + user['email'], 500)
    res.first_name = user['first name']
    res.last_name = user['last name']
    res.password = encrypt_password(user['password'])
    res.bio = user['bio']
    res.roles = []
    res.roles.append(user_datastore.find_or_create_role(user['role']))
    res.save()
    res = make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json'

    return make_response("User with email: " + user['email'] + ' updated', '200')




@app.route('/api/users/<email:mail>', methods=['GET'])
@login_required
def getUser(mail):

    """Return user with given mail as json

        Returns:
            res: A user with given mail as json
        """
    res = user_datastore.get_user(mail)
    if res is None:
        return make_response('Unknown User with Email-address: ' + mail, 500)

    #return res
    return jsonify(res)


@app.route('/api/users/', methods=['GET'])
@login_required
def getUsers():

    """Return a list with all user

        Returns:
            res: A list with all user as json
        """
    res = coll_user.find({})
    if res is None:
        return make_response('User list is empty', 500)

    res = make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json'

    return res





if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
