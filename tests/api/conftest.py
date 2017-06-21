import json
import os
from os.path import abspath, dirname

import docker
import pytest
import requests

from elasticsearch import Elasticsearch
from jsonschema import Draft4Validator, FormatChecker
from pymongo import MongoClient


@pytest.fixture(scope='session')
def docker_client():
    """
    to run this properly you have to install pypiwin32 if you are on windows
    :return: a docker client
    """
    client = docker.from_env()
    return client


@pytest.fixture(scope='session')
def flask_api_url():
    flask_api_url = "http://localhost:5000"
    return flask_api_url


@pytest.fixture(scope='session')
def mongo_client():
    client = MongoClient('localhost', 27017)
    db = client.knexdb
    return db


@pytest.fixture(scope='session')
def elastic_client():
    es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
    return es


@pytest.yield_fixture(scope='session')
def session():
    session = requests.Session()
    data = {"email": "admin@knex.com", "password": "admin"}
    response = session.post(flask_api_url() + '/api/users/login',
                            data=data)
    yield session
    response = session.get(flask_api_url() + '/api/users/logout')


@pytest.fixture(scope='session')
def manifest_validator():
    path_to_schema = os.path.join(abspath(dirname(dirname(__file__))), os.path.pardir,
                                  "backend", "manifest_schema.json")
    with open(path_to_schema, mode='r') as schema_file:
        schema = json.load(schema_file)
    validator = Draft4Validator(schema, format_checker=FormatChecker())
    return validator


@pytest.yield_fixture(autouse=True)
def run_around_tests(mongo_client):
    # Code that will run before your test, for example:
    # files_before = # ... do something to check the existing files
    result = mongo_client.projects.delete_many({})
    # A test function will be run at this point
    yield
    # Code that will run after your test, for example:
    result = mongo_client.projects.delete_many({})
    # files_after = # ... do something to check the existing files
    # assert files_before == files_after


@pytest.fixture(scope="session")
def enter_data_using_post(pytestconfig, flask_api_url):
    test_manifest = os.path.join(
        str(pytestconfig.rootdir),
        'tests',
        'testmanifests',
        'validexample0.json5'
    )
    with open(test_manifest, 'r', encoding='utf-8') as tf:
        data = str(tf.read().replace('\n', ''))
    response = requests.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                             headers={'Content-Type': 'application/json5'})
    print(response.text)
    return response