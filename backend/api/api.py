import json

from flask import Flask, g
from pymongo import MongoClient

# import elastic
from rest.manifest.manifest import Manifest

app = Flask(__name__)


@app.route('/')
def index():
    return g.db.database_names()[0]
    # return elastic.elastic_example()


@app.route('/api/rest/createProject/<manifest_file_str>', methods=["POST"])
def add_manifest_to_database(manifest_file_str):
    # manifest ist validated
    # TODO create exception return if validator cant validate manifest
    manifest_json = json.loads(manifest_file_str)
    manifest = Manifest(manifest_json)
    if not manifest.validate():
        return manifest.get_errors()

    # TODO check if already in database

    # TODO add data to database

    pass


@app.route('/api/rest/getProject/<project_id>', methods=["GET"])
def get_project(project_id):
    # TODO get project from database to display project page
    return g.db.knex


@app.route('/api/rest/seach/<searchparamas>', methods=["GET"])
def search_with_params(seachparams):
    # TODO get project from database to display project page
    return seachparams


def get_db():
    if not hasattr(g, 'db'):
        g.db = MongoClient(host='mongodb', port=27017)
    return g.db


def add_json(db, json):
    db.jsoncollection.insert(json)


def get_random_json(db):
    return db.jsoncollection.find_one()


def find_by_title(db, title):
    return db.jsoncollection.find({"title": title})


@app.before_request
def before_request():
    get_db()


@app.teardown_request
def teardown_request(exception):
    g.db.close()


if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000, debug=True)
