from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from pymongo import MongoClient
from manifest_validator import ManifestValidator
import time, json5, uuid, json
import elastic
from elasticsearch import Elasticsearch
from bson.json_util import dumps


client=MongoClient('mongodb:27017')
db=client.knexDBmh1
coll=db.projects

schema = open("manifest_schema.json")
validator = ManifestValidator(schema)

es = Elasticsearch(['http://elasticsearch:9200'])
app=Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def index():
    return make_response('', 404)

# receive manifest as a jsonstring
# returns new id
@app.route('/api/projects', methods=['POST'])
def add_project():
    manifest=request.json
    manifest['date_creation'] = time.strftime("%Y-%m-%d")
    manifest['date_update'] = time.strftime("%Y-%m-%d")

    schema = open("manifest_schema.json")
    error = validator.validate_manifest(manifest)

    if error == None:
        manifest['id']=uuid.uuid4()
        coll.insert(manifest)
        elastic.store_json("test", "projects", manifest)
        return make_response(manifest['id'])
    else:
        return make_response((error, '302'))

# return list of projects, args->limit, skip
@app.route('/api/projects', methods=['GET'])
def get_projects():
    limit=request.args.get('limit', type=int)
    skip=request.args.get('skip', type=int)
    
    argc=len(request.args)

    if coll.projects.count() == 0:
        return make_response('There are no projects', 500)

    if argc==0:
        res=coll.find({})
    elif limit and skip and argc<3:
        res=coll.find({}, limit=limit, skip=skip)
    elif limit and argc<2:
        res=coll.find({}, limit=limit)
    elif skip and argc<2:
        res=coll.find({}, skip=skip)
    else:
        return make_response('Invalid parameters',400)

    res=make_response(dumps(res))
    res.headers['Content-Type'] = 'application/json' 

    return res

@app.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    res=coll.find_one({'_id': project_id})
    if res is None:
      return make_response('Project not found', 404)
    return jsonify(res)

@app.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
def delete_project(project_id):
    if coll.delete_one({'_id':project_id}).deleted_count != 0:
        return make_response('Success')
    else:
        return make_response('Project not found', 404)

# receive body of elasticsearch query
@app.route('/api/projects/search', methods=['POST'])
def search():
    res=es.search(index="test", doc_type="projects", body=request.json)
    return jsonify(res)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
