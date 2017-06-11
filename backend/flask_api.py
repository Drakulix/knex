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
from jsonschema import FormatChecker, Draft4Validator
from pymongo import MongoClient, ReturnDocument
from werkzeug.utils import secure_filename

import uploader
from apiexception import ApiException

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
                raise ApiException("Wrong content header and no files attached", 400)
            return jsonify(return_ids)

        except ApiException as e:
            raise e
        except UnicodeDecodeError as ue:
            raise ApiException('Only utf-8 compatible charsets are supported, ' +
                               'the request body does not appear to be utf-8.', 400)
        except Exception as err:
            raise ApiException(str(err), 400)


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
        return make_response('Success')
    except Exception:
        if coll.delete_one({'_id': project_id}).deleted_count == 0:
            return make_response('Project not found', 404)
        else:
            return make_response('Success')


# TODO
@app.route('/api/projects/<uuid:project_id>', methods=['PUT'])
def update_project(project_id):
    try:
        res = coll.find_one({'_id': project_id})
        if res is None:
            raise ApiException("Project not found", 404)
        # TODO checkmimetype
        elif request.is_json:
            manifest = request.json
            if manifest['_id'] != str(project_id):
                raise ApiException("Updated project owns different id", 409)
            is_valid = validator.is_valid(manifest)
            print(is_valid, file=sys.stderr)
            if is_valid:
                print(manifest['_id'])
                manifest['_id'] = project_id
                manifest['date_update'] = time.strftime("%Y-%m-%d")
                coll.find_one_and_replace({'_id': project_id}, manifest,
                                          return_document=ReturnDocument.AFTER)
                print("mongo replaced: ", file=sys.stderr)
                es.index(index="projects-index", doc_type='Project',
                          id=manifest["_id"], refresh=True, body={})
                print("Successfully replaced content: ", file=sys.stderr)
                print(manifest, file=sys.stderr)
                return make_response('Success')
            else:
                v = validator.iter_errors(manifest)
                if v is not None:
                    validation_error = []
                    for error in sorted(validator.iter_errors(manifest), key=str):
                        print(error.message, file=sys.stderr)
                        validation_error.append(error.message)
                raise ApiException("Validation Error: \n" + str(is_valid), 400, validation_error)
        else:
            raise ApiException("Not Json", 400)
    except ApiException as e:
        raise e
    except Exception as err:
        raise ApiException(str(err), 500)


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

    # ^3 is boosting the attribute, *_is allowing wildcards to be used
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
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
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

    # ^3 is boosting the attribute, *_is allowing wildcards to be used
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
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
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
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
        return (jsonify(res['hits']))
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
        res = es.search(index="projects-index", doc_type="Project", body=request_json)
        return (jsonify(res['suggest']['phraseSuggestion'][0]['options']))
    except RequestError as e:
        return (str(e), 400)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
