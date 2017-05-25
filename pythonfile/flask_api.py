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


@app.route('/api/projects/delete/<project_id>')
def delete_project(project_id):
    #deletion from elastic search index
    try:
        res = es.delete(index="projects-index", doc_type='Project', id=project_id, refresh=True)
    except NotFoundError:
        return make_response('Project not found', 404)
    except:
        return make_response('Unexpected Error', 500)
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
    except:
       return ("Error: Index probablly empty!")

# dummy add a few projects to es
#Note: deleting these projects will throw not found error bcause they are in es only, but they are deleted
@app.route('/api/projects/dummyadd', methods=['GET'])
def dummyadd():
    doc1 = {
    'author': 'James Comey',
    'text': 'Hi, I am a cool new project lets search for me ^^',
    'timestamp': datetime.now(),
    'tags': ['Performance', 'AB-Testing', 'AnotherTag']
    }
    doc2 = {
    'author': 'Max Mustermann',
    'text': 'Wow an awesome project I got here, check it out',
    'timestamp': datetime.now(),
    'tags': ['Project', 'Computer', 'TagsAreGreat']
    }
    doc3 = {
    'author': 'Mr x',
    'text': 'Here is anonther project not so great',
    'timestamp': datetime.now(),
    'tags': ['Something', 'XY-Testing', 'AnotherTag']
    }
    output = ""
    res = es.index(index="projects-index", doc_type='Project', id=1, body=doc1)
    output += json.dumps(res)
    res = es.index(index="projects-index", doc_type='Project', id=2, body=doc2)
    output += json.dumps(res)
    res = es.index(index="projects-index", doc_type='Project', id=3, body=doc3)
    output += json.dumps(res)
    return (output)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
