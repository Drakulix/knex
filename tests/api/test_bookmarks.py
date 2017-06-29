import requests
from flask import jsonify
import uuid


class TestBookmarks(object):

    def get_Bookmarks_without_logging(self, flask_api_url):
        response = requests.get(flask_api_url + "/api/users/bookmarks")
        assert response.status_code == 400

    def get_empty_bookmark(self, flask_api_url):
        payload = {'email': 'admin@knex.com', 'password': "admin"}
        response = requests.post(flask_api_url + "/api/users/login",
                                 data=payload)
        response = requests.get(flask_api_url + "/api/users/bookmarks")

        assert jsonify([]) == response.text

    def insert_project_to_bookmark(self, flask_api_url):
        local_list = []
        id1 = uuid.uuid4()
        local_list.append(id1)
        payload = {'email': 'admin@knex.com', 'password': "admin"}
        response = requests.post(flask_api_url + "/api/users/bookmarks/" +
                                 str(id1))

        assert jsonify(local_list) == response.text

    def delete_project_from_bookmark(self, flask_api_url):
        local_list = []
        id1 = uuid.uuid4()
        local_list.append(id1)
        payload = {'email': 'admin@knex.com', 'password': "admin"}
        response = requests.remove(flask_api_url + "/api/users/bookmarks/" +
                                   str(id1))
        local_list.remove(id1)
        assert jsonify(local_list) == response.text

    def insert_multiple_project_to_bookmark(self, flask_api_url):
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

    def insert_multiple_project_to_bookmark(self, flask_api_url):
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
