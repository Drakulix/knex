import json
import time
import uuid

import json5
from elasticsearch import Elasticsearch
from flask import Flask, g, request, jsonify, abort
from jsonschema import Draft4Validator, FormatChecker
from pymongo import MongoClient

app = Flask(__name__)
db = MongoClient(host='mongodb', port=27017)
es = Elasticsearch(['http://elasticsearch:9200'])


def get_db():
    if not hasattr(g, 'db'):
        g.db = db.knex
    return g.db


def validate(manifest):
    schema = json.load("./manifest/manifest_schema.json")
    validator = Draft4Validator(schema, format_checker=FormatChecker())
    errors = validator.iter_errors(manifest)
    return jsonify(errors)


@app.before_request
def before_request():
    get_db()


@app.route('/')
def index():
    return g.db.collection_names(include_system_collections=False)[0]
    # return elastic.elastic_example()


@app.route('/api/projects/add', methods=['POST'])
def add_project():
    manifest = request.json['manifest']
    manifest['date_creation'] = time.strftime("%Y-%m-%d")
    manifest['date_update'] = time.strftime("%Y-%m-%d")
    json5.dumps(manifest)
    error = validate(manifest)

    if error is None:
        _id = uuid.uuid4()
        manifest['_id'] = _id
        g.db.insert(manifest)
        return jsonify(manifest)
    else:
        return abort(401)


@app.route('/api/projects', methods=['GET'])
def get_projects():
    res = g.db.projects.find_one()
    return jsonify(res)


@app.route('/api/projects/<project_id>', methods=['GET', 'PUT', 'DELETE'])
def get_project_by_id(project_id):
    if request.method == 'GET':
        res = g.db.find_one({'_id': project_id})
        return jsonify(res)
    elif request.method == 'PUT':
        if request.header['Content-Type'] == 'application/json':
            manifest = request.json['manifest']
            validate(manifest)
            return jsonify(manifest)

        return abort(401)
    elif request.method == 'DELETE':
        return jsonify(g.db.delete_one({'_id': project_id}).raw_result)
    else:
        return abort(400)


# receive body of elasticsearch query
# {'query':body}
@app.route('/api/projects/search', methods=['POST'])
def search():
    query = request.json['query']
    res = es.search(index="test", doc_type="projects", body=query)
    return jsonify(res)


@app.teardown_request
def teardown_request(exception):
    db.close()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
