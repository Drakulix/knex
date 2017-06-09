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

    def test_missformed_json_error(self, flask_api_url, pytestconfig):
        """Test both invalid json and for json which does not match,
        test for Bad Request and Validation Error.
        """
        invalid_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'invalidexample0.json'
        )
        unmatching_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'invalidexample1.json'
        )
        with open(invalid_manifest, 'r', encoding='utf-8') as tf:
            invalid_data = str(tf.read().replace('\n', ''))
        invalid_response = requests.post(flask_api_url + "/api/projects", data=invalid_data.encode('utf-8'),
                                         headers={'Content-Type': 'application/json5'})
        print(invalid_response.text)

        with open(unmatching_manifest, 'r', encoding='utf-8') as tf:
            unmatching_data = str(tf.read().replace('\n', ''))
        unmatching_response = requests.post(flask_api_url + "/api/projects", data=unmatching_data.encode('utf-8'),
                                            headers={'Content-Type': 'application/json5'})
        print(unmatching_response.text)

        assert invalid_response.status_code == 400
        assert 'Validation Error' in unmatching_response.text

    def test_misformed_content_type(self, flask_api_url, pytestconfig):
        """Test if wrong content-type header with valid json will raise error.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                 headers={'Content-Type': 'image/gif'})
        print(response.text)
        assert response.status_code == 400


class TestDELETE(object):

    def test_unknown_id(self, flask_api_url):
        """ Test for 404 when a project with unknown ID is to be deleted.
        """
        invalid_id = "invalid"
        response = requests.delete(flask_api_url + "/api/projects/" + invalid_id)
        print(response.text)
        assert response.status_code == 404

    def test_success(self, flask_api_url, pytestconfig):
        """ Test successful delete (after successful upload).
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        post_response = requests.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(post_response.text)
        for id in post_response.json():
            assert UUID(id, version=4)

        project_id = post_response.json()[0]
        delete_response = requests.delete(flask_api_url + "/api/projects/" + project_id)
        print(delete_response.text)

        assert delete_response.status_code == 200

    def test_unconsistent_delete(self, flask_api_url, pytestconfig):
        assert True


class TestGET(object):

    def test_unknown_id(self, flask_api_url):
        """ Test for 404 when a project with unknown ID is to be deleted.
        """
        invalid_id = "invalid"
        response = requests.get(flask_api_url + "/api/projects/" + invalid_id)
        print(response.text)
        assert response.status_code == 404

    def test_success_getall(self, flask_api_url):
        assert True

    def test_success_getid(self, flask_api_url, pytestconfig):
        """ Test successful get (after successful upload).
        Checks for both 200 and also valid title and analysis.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        post_response = requests.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(post_response.text)
        for id in post_response.json():
            assert UUID(id, version=4)

        project_id = post_response.json()[0]
        get_response = requests.get(flask_api_url + "/api/projects/" + project_id)
        print(get_response.text)

        assert get_response.status_code == 200
        assert get_response.json()["title"] == test_manifest_json["title"]
        assert get_response.json()["analysis"] == test_manifest_json["analysis"]


class TestPUT(object):

    def test_unknown_id(self, flask_api_url):
        assert True

    def test_success(self, flask_api_url):
        assert True
