import json
import os
import time
from uuid import UUID

import requests


class TestPOST(object):
    def test_empty_post(self, flask_api_url):
        # TODO
        assert True

    def test_success_json5(self, flask_api_url, pytestconfig):
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
        for id in response.json():
            assert UUID(id, version=4)

    def test_success_json(self, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = requests.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(response.text)
        for id in response.json():
            assert UUID(id, version=4)

    def test_validtion_error(self, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'invalidexample0.json'
        )
        with open(test_manifest, 'r', encoding='UTF-8') as tf:
            data = str(tf.read().replace('\n', ''))
        print(data)
        response = requests.post(flask_api_url + "/api/projects", data=data,
                                 headers={'Content-Type': 'application/json'})
        print(response.text)

    def test_missformed_json_error(self, flask_api_url):
        assert True

    def test_missformed_content_type(self, flask_api_url):
        assert True

    def test_inconsistent_post(self, flask_api_url, pytestconfig, mongo_client, elastic_client):
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
        for project_id in response.json():
            # This should pass if post is working properly
            assert UUID(project_id, version=4)
            project_uuid = UUID(project_id, version=4)
            time.sleep(5)
            print(project_id)
            mongo_test = mongo_client.projects.find({})
            mongo_result = mongo_client.projects.find_one(project_uuid)
            print("mongo:", mongo_result)

            # fails for mongo error
            assert mongo_result["_id"] == project_uuid
            es_result = elastic_client.get(index="knexdb", id=project_id)
            print("es:", es_result)
            # fails for es not found error
            assert es_result['found']
        # Start checking both databases



class TestDELETE(object):
    def test_unknown_id(self, flask_api_url):
        assert True

    def test_success(self, flask_api_url):
        assert True

    def test_inconsistent_delete(self, flask_api_url):
        assert True


class TestGET(object):
    def test_unknown_id(self, flask_api_url):
        assert True

    def test_success_getall(self, flask_api_url):
        assert True

    def test_success_getid(self, flask_api_url):
        assert True


class TestPUT(object):
    def test_unknown_id(self, flask_api_url):
        assert True

    def test_success(self, flask_api_url):
        assert True
