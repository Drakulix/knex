import json
import os
import sys

import json5
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import RequestError
from flask import request, jsonify, make_response, Blueprint, current_app, g
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient
from werkzeug.utils import secure_filename

from api.exceptions.apiexception import ApiException
from api.projects_helper import uploader

projects = Blueprint('api_projects', __name__)


@projects.before_request
def init_global_manifest_validator():
    with projects.open_resource("schema_files/manifest_schema.json") as schema_file:
        schema = json.load(schema_file)
    g.validator = Draft4Validator(schema, format_checker=FormatChecker())


@projects.before_request
def init_gloabl_elasticsearch():
    g.es = Elasticsearch([{'host': 'elasticsearch', 'port': 9200}])


@projects.before_request
def init_gloabl_mongoclienth():
    g.client = MongoClient('mongodb:27017')
    g.db = g.client.knexDB
    g.coll = g.db.projects


@projects.route('/', methods=['GET'])
def index():
    """Index of knex
    """
    return make_response('', 404)


@projects.route('/api/projects', methods=['POST'])
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
                file.save(os.path.join(current_app.config['UPLOAD_FOLDER'], securefilename))
                try:
                    newId = uploader.save_file_to_db(securefilename)
                    # represent original filename
                    successful_files.append(file.filename + " " + str(newId))
                except ApiException as e:
                    unsuccessful_files.append(file.filename + str(e))

                print("Successful files: ", successful_files, '\n', file=sys.stderr)
                print("Unsuccessful files: ", unsuccessful_files, '\n', file=sys.stderr)
        return make_response('Successful files: ' +
                             ', '.join(e for e in successful_files) +
                             '<br />' + " Unsuccessful files: " +
                             ', '.join(e for e in unsuccessful_files))

    elif request.content_type == 'application/json' or request.content_type == 'application/json5':
        try:
            return_ids = []
            if request.json:
                return_ids = uploader.save_manifest_to_db(request.json)

            elif request.data:
                print(request.data.decode("utf-8"), file=sys.stderr)
                return_ids = uploader.save_manifest_to_db(
                    json5.loads(request.data.decode("utf-8")))

            else:
                return make_response("Error: empty POST body", 400)

            return jsonify(return_ids)
        except ApiException as e:
            raise e

    else:
        raise ApiException("Wrong content header and no files attached", 400)


@projects.errorhandler(ApiException)
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


@projects.route('/upload', methods=['GET'])
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


@projects.route('/api/projects', methods=['GET'])
def get_projects():
    """Return list of projects, args->limit, skip

    Returns:
        res: A list of projects
    """
    limit = request.args.get('limit', type=int)
    skip = request.args.get('skip', type=int)
    argc = len(request.args)

    if g.coll.count() == 0:
        return make_response('There are no projects', 500)

    if argc == 0:
        res = g.coll.find({})
    elif limit and skip and argc < 3:
        res = g.coll.find({}, limit=limit, skip=skip)
    elif limit and argc < 2:
        res = g.coll.find({}, limit=limit)
    elif skip and argc < 2:
        res = g.coll.find({}, skip=skip)
    else:
        return make_response('Invalid parameters', 400)

    res = make_response(jsonify([x for x in res[:]]))
    res.headers['Content-Type'] = 'application/json'
    return res


@projects.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    """Returns project by ID number, 404 if it is not found.

    Args:
        project_id: The ID of the project which should get returned

    Returns:
        res (json): Project corresponding to the ID
    """
    res = g.coll.find_one({'_id': project_id})
    if res is None:
        return make_response('Project not found', 404)
    return jsonify(res)


@projects.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
def delete_project(project_id):
    """Deletes a project by ID.

    Args:
        project_id: ID of a project

    Returns:
        response: Success response or 404 if project is not found
    """
    try:
        g.es.delete(index="projects-index", doc_type='Project', id=project_id, refresh=True)
    except Exception as e:
        if g.coll.delete_one({'_id': project_id}).deleted_count == 0:
            return make_response('Project not found', 404)
        else:
            return make_response('Success')
    else:
        g.coll.delete_one({'_id': project_id})
        return make_response('Success')


@projects.route('/api/projects/search', methods=['POST'])
def search():
    """Receive body of elasticsearch query

    Returns:
        res (json): Body of the Query
    """
    try:
        res = g.es.search(index="projects-index", doc_type="Project", body=request.json)
        return jsonify(res)
    except RequestError as e:
        return str(e), 400
