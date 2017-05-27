from flask import Flask, request, jsonify, make_response
from pymongo import MongoClient
from manifest_validator import ManifestValidator
import time, json5, uuid, json
from datetime import datetime
import elastic
from elasticsearch import Elasticsearch
from elasticsearch.exceptions import RequestError


client=MongoClient('mongodb:27017')
db=client.knexDBmh1
coll=db.projects

#validator = ManifestValidator(schema)

es = Elasticsearch(['http://elasticsearch:9200'])
app=Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return make_response('', 404)

# receive manifest as a jsonstring
# returns new id
#Note: Should work, but not tested
@app.route('/api/projects', methods=['POST'])
def add_project():
    manifest=request.json
    manifest['date_creation'] = time.strftime("%Y-%m-%d")
    manifest['date_update'] = time.strftime("%Y-%m-%d")

    schema = open("manifest_schema.json")
    error = validator.validate_manifest(manifest)

    if error == None:
        manifest['id']=uuid.uuid4()
        #inserts in mongo db
        coll.insert(manifest)
        #inserts in elasticsearch now
        res = es.index(index="projects-index", doc_type='Project', id=manifest['id'], body=manifest)
        return make_response(manifest['id'])
    else:
        return make_response((error, '302'))

@app.route('/api/projects/get/<project_id>')
def get_project_by_id(project_id):
    res=coll.find_one({'_id':project_id})
    return jsonify(res)

#Note: works, but needs more exception handling
@app.route('/api/projects/delete/<project_id>')
def delete_project(project_id):
    #deletion from elastic search index
    try:
        res = es.delete(index="projects-index", doc_type='Project', id=project_id, refresh=True)
    except NotFoundError:
        return make_response('Project not found', 404)
    #Deletion from Mongodb and return
    if (coll.delete_one({'_id':project_id}).deleted_count != 0):
        return make_response('Success')
    else:
        return make_response('Project not found', 404)



#Note, works but need better exception handlin on empty index
@app.route('/api/projects/search', methods=['POST'])
#@app.route('/api/projects/search')
def search():
    try: 
        res=es.search(index="projects-index", doc_type="Project", body=request.json)
        return jsonify(res)
    except RequestError:
        return ("Some Error")
    else:
       return ("Error: Index probablly empty!")

# dummy add a few projects to es
#Note: deleting these projects will throw not found error bcause they are in es only, but they are deleted
@app.route('/api/projects/dummyadd', methods=['GET'])
def dummyadd():
    output = "["

    f = open('jsonprojectexamples/example0.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=1, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example1.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=2, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example2.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=3, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example3.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=4, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example4.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=5, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example5.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=6, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example6.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=7, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example7.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=8, body=doc)
    output += json.dumps(res) + " , "

    f = open('jsonprojectexamples/example8.json5', 'r')
    doc =f.read()
    res = es.index(index="projects-index", doc_type='Project', id=9, body=doc)
    output += json.dumps(res) + " ]"

    return (output)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
