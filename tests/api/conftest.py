import docker
import pytest
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
