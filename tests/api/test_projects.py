import json
import os
import time
import requests
import uuid

from uuid import UUID


class TestPOST(object):

    def test_empty_post(self, flask_api_url):
        """ Tests for 400 when the post body is empty.
        """
        response = requests.post(flask_api_url + "/api/projects")
        print(response.text)

        assert response.status_code == 400

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

    def test_success_json5_upload(self, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'rb') as tf:
            response = requests.post(flask_api_url + "/api/projects",
                                     files={'file[]': (test_manifest, tf)})
            print(response.text)
            for id in response.json():
                assert UUID(id, version=4)

    def test_success_json_upload(self, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'rb') as tf:
            response = requests.post(flask_api_url + "/api/projects",
                                     files={'file[]': (test_manifest, tf)})
            print(response.text)
            for id in response.json():
                assert UUID(id, version=4)

    def test_encoding_error(self, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r', encoding='UTF-8') as tf:
            data = str(tf.read().replace('\n', ''))
        print(data)
        data32 = data.encode('utf-32')
        response = requests.post(flask_api_url + "/api/projects", data=data32,
                                 headers={'Content-Type': 'application/json5'})
        assert response.status_code == 400
        assert 'request body does not appear to be utf-8' in response.text

    def test_validation_error(self, flask_api_url, pytestconfig):
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

    def test_misformed_json_error(self, flask_api_url, pytestconfig):
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
        invalid_response = requests.post(flask_api_url + "/api/projects",
                                         data=invalid_data.encode('utf-8'),
                                         headers={'Content-Type': 'application/json5'})
        print(invalid_response.text)

        with open(unmatching_manifest, 'r', encoding='utf-8') as tf:
            unmatching_data = str(tf.read().replace('\n', ''))
        unmatching_response = requests.post(flask_api_url + "/api/projects",
                                            data=unmatching_data.encode('utf-8'),
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

    def test_jsonheader_json5file(self, flask_api_url, pytestconfig):
        """Test if a json5-file with a json-content header still gets accepted.
        Should not pass.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json'})
        print(response.text)
        assert response.status_code == 400

    def test_json5header_jsonfile(self, flask_api_url, pytestconfig):
        """Test if a json-file with a json5-content header still gets accepted.
        Should pass because of backwards compatibility
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
                                 headers={'Content-Type': 'application/json5'})
        print(response.text)
        assert response.status_code == 200

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
        """ Test for 404 when a project with unknown ID is to be deleted.
        """
        unknown_id = str(uuid.uuid4())
        response = requests.delete(flask_api_url + "/api/projects/" + unknown_id)
        print(response.text)
        assert response.status_code == 404

    def test_invalid_id(self, flask_api_url):
        """ Test for 405 when a project with ID of invalid format is to be deleted.
            The method does expect a uuid, a string will return invalid method
        """
        invalid_id = "invalid"
        response = requests.delete(flask_api_url + "/api/projects/" + invalid_id)
        print(response.text)
        assert response.status_code == 405

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
        assert pose_response.status_code == 200

    def test_inconsistent_delete(self, flask_api_url, pytestconfig):
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


class TestGET(object):

    def test_unknown_id(self, flask_api_url):
        """ Test for 404 when a project with unknown ID is to be deleted.
        """
        unknown_id = str(uuid.uuid4())
        response = requests.get(flask_api_url + "/api/projects/" + unknown_id)
        print(response.text)
        assert response.status_code == 404

    def test_invalid_id(self, flask_api_url):
        """ Test for 404 when a project with ID in invalid format is to be deleted.
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
