import json5
import time
import uuid

from elasticsearch import Elasticsearch
from first import jsonstring
from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient

import elastic
from manifest_validator import ManifestValidator

client=MongoClient('mongodb:27017')
db=client.knexDBmh1
coll=db.projects

es = Elasticsearch(['http://elasticsearch:9200'])


app=Flask(__name__)



_id=uuid.uuid4()


# add project to test with
@app.before_first_request
def create_project():
    
    jsonstring['date_creation']=time.strftime("%Y-%m-%d")
    jsonstring['date_update']=time.strftime("%Y-%m-%d")
    json5.dumps(jsonstring)
    schema = open("manifest_schema.json")
    validator = ManifestValidator(schema)
    error = validator.validate_manifest(jsonstring)

    if error == None:
        
        jsonstring['_id']=_id
        coll.insert(jsonstring)
        elastic.store_json("test", "projects", jsonstring)

    
@app.route('/', methods=['GET'])
def index():
    return jsonify(coll.find_one(_id))

# receive manifest as a jsonstring
# {'manifest':manifest}
@app.route('/api/projects', methods=['POST'])
def add_project():

    manifest=request.json['manifest']
    manifest['date_creation']=time.strftime("%Y-%m-%d")
    manifest['date_update']=time.strftime("%Y-%m-%d")
    json5.dumps(manifest)
    schema = open("manifest_schema.json")
    validator = ManifestValidator(schema)
    error = validator.validate_manifest(manifest)

    if error == None:
        _id=uuid.uuid4()    
        manifest['_id']=_id
        coll.insert(manifest)
        elastic.store_json("test", "projects", manifest)
        return make_response(manifest['_id'].hex)
    else:
        return make_response(error)

@app.route('/api/projects', methods=['GET'])  
@app.route('/api/projects/<uuid:project_id>', methods=['GET'])
def get_project_by_id(project_id):
    res=coll.find_one({'_id':project_id})
    return jsonify(res)

# returns DeleteResult.raw_result
@app.route('/api/projects', methods=['DELETE'])  
@app.route('/api/projects/<uuid:project_id>', methods=['DELETE'])
def delete_project(project_id):
    return jsonify(coll.delete_one({'_id':project_id}).raw_result)
    

# receive body of elasticsearch query
#{'query':body}
@app.route('/api/projects/search', methods=['POST'])
def search():
    query=request.json['query']
    res=es.search(index="test", doc_type="projects", body=query)
    return jsonify(res)
    

if __name__ == "__main__":
    app.run(port=5000, debug=True)
