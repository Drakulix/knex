import json
import os
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
        with open(test_manifest, 'r', encoding='UTF16') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects", data=data.encode('UTF-8'),
                                 headers={'Content-Type': 'application/json5'})
        print(response.text)
        assert UUID(response.text, version=4)

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

    def test_missformed_context_type(self, flask_api_url):
        assert True


class TestDELETE(object):
    def test_unknown_id(self, flask_api_url):
        assert True

    def test_success(self, flask_api_url):
        assert True

    def test_unconsistent_delete(self, flask_api_url):
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