import docker
import pytest
import requests

from elasticsearch import Elasticsearch
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
