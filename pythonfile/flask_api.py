
from flask import Flask, request, jsonify
from pymongo import MongoClient
from manifest_validator import ManifestValidator
import time, json5, uuid, json
from first import jsonstring
import elastic
from elasticsearch import Elasticsearch

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
    r = validator.validate_manifest(jsonstring)

    if r == None:
        
        jsonstring['_id']=_id
        coll.insert(jsonstring)
        elastic.store_json("test", "projects", jsonstring)

    
@app.route('/', methods=['GET','POST'])
def index():
    return jsonify(coll.find_one(_id))

# receive manifest as a jsonstring
# {'manifest':manifest}
@app.route('/add_project')
def add_project():

    manifest=request.json['manifest']
    manifest['date_creation']=time.strftime("%Y-%m-%d")
    manifest['date_update']=time.strftime("%Y-%m-%d")
    json5.dumps(manifest)
    schema = open("manifest_schema.json")
    validator = ManifestValidator(schema)
    r = validator.validate_manifest(manifest)

    if r == None:
        _id=uuid.uuid4()    
        manifest['_id']=_id
        coll.insert(manifest)
        elastic.store_json("test", "projects", manifest)
        return ('project imported \n')
    
    
@app.route('/get_project_by_id/<uuid:project_id>', methods=['GET','POST'])
def get_project_by_id(project_id):
    res=coll.find_one({'_id':project_id})
    return jsonify(res)

@app.route('/delete_project/<uuid:project_id>')
def delete_project(project_id):
    coll.delete_one({'_id':project_id})
    return ('project deleted \n')

# receive body of elasticsearch query
#{'query':body}
@app.route('/search', methods=['GET','POST'])
def search():
    query=request.json['query']
    res=es.search(index="test", doc_type="projects", body=query)
    return jsonify(res)
    

if __name__ == "__main__":
    app.run(port=5000, debug=True)
