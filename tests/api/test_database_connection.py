import time
import uuid
import requests


def test_no_mongo(flask_api_url, docker_client):
    # TODO
    assert True


def test_no_elastic(flask_api_url, docker_client):
    # TODO
    assert True


def test_empty_database(flask_api_url, mongo_client, session):
    """
    :param flask_api_url:
    :param mongo_client:
    :return:
    """
    result = mongo_client.projects.delete_many({})
    print("Database cleaned: ", result)
    response = session.get(flask_api_url + "/api/projects")
    assert response.status_code == 200
    assert len(response.json()) == 0
    print(response.text)
