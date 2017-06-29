import requests
import json
from flask import jsonify
import uuid


def test_get_empty_bookmark(flask_api_url):
    response = requests.post(flask_api_url + '/api/users/login',
                             data=dict(email='admin@knex.com', password='admin'))

    print(response)
    response = requests.get(flask_api_url + "/api/users/bookmarks")

    assert json.dumps([]) == response.text


def test_insert_project_to_bookmark(flask_api_url):
    local_list = []
    id1 = uuid.uuid4()
    local_list.append(id1)
    payload = {'email': 'admin@knex.com', 'password': "admin"}
    response = requests.post(flask_api_url + "/api/users/bookmarks/" +
                             str(id1))

    assert json.dumps(local_list) == response.text


def test_delete_project_from_bookmark(flask_api_url):
    local_list = []
    id1 = uuid.uuid4()
    local_list.append(id1)
    payload = {'email': 'admin@knex.com', 'password': "admin"}
    response = requests.remove(flask_api_url + "/api/users/bookmarks/" +
                               str(id1))
    local_list.remove(id1)
    assert jsonify(local_list) == response.text


def test_insert_multiple_project_to_bookmark(flask_api_url):
    local_list = []
    id1 = uuid.uuid4()
    id2 = uuid.uuid4()
    id3 = uuid.uuid4()
    id4 = uuid.uuid4()
    local_list.append(id1)
    local_list.append(id2)
    local_list.append(id3)
    local_list.append(id4)
    payload = {'email': 'admin@knex.com', 'password': "admin"}
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id1))
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id2))
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id3))
    response = requests.post(flask_api_url + "/api/users/bookmarks/" +
                             str(id4))
    assert jsonify(local_list) == response.text


def test_insert_multiple_project_to_bookmark(flask_api_url):
    local_list = []
    id1 = uuid.uuid4()
    id2 = uuid.uuid4()
    id3 = uuid.uuid4()
    id4 = uuid.uuid4()
    local_list.append(id1)
    local_list.append(id2)
    local_list.append(id3)
    local_list.append(id4)
    payload = {'email': 'admin@knex.com', 'password': "admin"}
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id1))
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id2))
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id3))
    requests.post(flask_api_url + "/api/users/bookmarks/" + str(id4))
    response = requests.delete(flask_api_url + "/api/users/bookmarks/" +
                               str(id3))
    local_list.remove(id3)
    assert jsonify(local_list) == response.text
