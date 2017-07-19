import json
import os
import docker
import pytest
import requests

from os.path import abspath, dirname
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
    url = "http://localhost:5000"
    return url


@pytest.fixture(scope='session')
def mongo_client():
    client = MongoClient('localhost', 27017)
    db = client.knexdb
    return db


@pytest.fixture(scope='session')
def elastic_client():
    es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
    return es


@pytest.fixture(scope='session')
def manifest_validator():
    path_to_schema = os.path.join(abspath(dirname(dirname(__file__))), os.path.pardir,
                                  "backend", "manifest_schema.json")
    with open(path_to_schema, mode='r') as schema_file:
        schema = json.load(schema_file)
    validator = Draft4Validator(schema, format_checker=FormatChecker())
    return validator


@pytest.yield_fixture(scope='session')
def session():
    _session = requests.Session()
    data = {"email": "admin@knex.com", "password": "admin"}
    _session.post(flask_api_url() + '/api/users/login',
                  data=data)
    yield _session
    _session.get(flask_api_url() + '/api/users/logout')


@pytest.yield_fixture(autouse=True)
def run_around_tests(mongo_client):
    """
    cleans up the projects collection in mongodb before and after each test
    :param mongo_client:
    :return:
    """
    mongo_client.projects.delete_many({})
    yield
    mongo_client.projects.delete_many({})


@pytest.yield_fixture()
def enter_data_using_post(pytestconfig, session):
    test_manifest = os.path.join(
        str(pytestconfig.rootdir),
        'tests',
        'testmanifests',
        'validexample0.json5'
    )
    with open(test_manifest, 'r', encoding='utf-8') as tf:
        data = str(tf.read().replace('\n', ''))
    response = session.post(flask_api_url() + "/api/projects", data=data.encode('utf-8'),
                            headers={'Content-Type': 'application/json5'})
    print(response.text)
    yield response


@pytest.yield_fixture()
def enter_archived_using_post(pytestconfig, flask_api_url, session):
    test_manifest = os.path.join(
        str(pytestconfig.rootdir),
        'tests',
        'testmanifests',
        'validexample0_archived.json5'
    )
    with open(test_manifest, 'r', encoding='utf-8') as tf:
        data = str(tf.read().replace('\n', ''))
    response = session.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                            headers={'Content-Type': 'application/json5'})
    print(response.text)
    yield response


@pytest.yield_fixture()
def enter_users(pytestconfig, session):
    user = {'email': 'dr.dagobert.duck@rich.com',
            'first_name': 'Dagobert',
            'last_name': 'Duck',
            'bio': 'super rich guy',
            'roles': 'user',
            'password': 'Mooooooooney'}
    add_user_response = session.post(flask_api_url() + "/api/users", json=user)
    for x in add_user_response:
        print(str(x))
    assert add_user_response.status_code == 200
    yield add_user_response

    delete_user_response = session.delete(flask_api_url() + '/api/users/' +
                                          add_user_response.json()['email'])
    print(delete_user_response.text)
    assert delete_user_response.status_code == 200

@pytest.yield_fixture()
def enter_default_user_users(pytestconfig, session):
    user = {'email': 'user@knex.com',
            'first_name': 'Dagobert',
            'last_name': 'Duck',
            'bio': 'super rich guy',
            'roles': 'user',
            'password': 'user'}
    add_user_response = session.post(flask_api_url() + "/api/users", json=user)
    for x in add_user_response:
        print(str(x))
    assert add_user_response.status_code == 200
    yield add_user_response

    delete_user_response = session.delete(flask_api_url() + '/api/users/' +
                                          add_user_response.json()['email'])
    print(delete_user_response.text)
    assert delete_user_response.status_code == 200

