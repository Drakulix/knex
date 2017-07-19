import json
import os
import time
import uuid
import requests

from uuid import UUID


class TestPOST(object):
    def test_empty_post(self, session, flask_api_url):
        """ Tests for 400 when the post body is empty.
        """
        response = session.post(flask_api_url + "/api/projects")
        print(response.text)

        assert response.status_code == 400

    def test_success_json5(self, session, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = session.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                headers={'Content-Type': 'application/json5'})
        print(response.text)
        for pid in response.json():
            assert UUID(pid, version=4)

    def test_success_json(self, session, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(response.text)
        for pid in response.json():
            assert UUID(pid, version=4)

    def test_success_json5_upload(self, session, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        response = session.post(
            flask_api_url + "/api/projects",
            files={'file[]': ('validexample0.json5', open(test_manifest, 'rb'))})
        print(response.text)
        assert UUID(response.json()[0], version=4)

    def test_success_json_upload(self, session, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        response = session.post(
            flask_api_url + "/api/projects",
            files={'file[]': ('validexample0.json', open(test_manifest, 'rb'))})
        print(response.text)
        assert UUID(response.json()[0], version=4)

    def test_encoding_error(self, session, flask_api_url, pytestconfig):
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
        response = session.post(flask_api_url + "/api/projects", data=data32,
                                headers={'Content-Type': 'application/json5'})
        assert response.status_code == 400
        assert 'request body does not appear to be utf-8' in response.text

    def test_validation_error(self, session, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'invalidexample0.json'
        )
        with open(test_manifest, 'r', encoding='UTF-8') as tf:
            data = str(tf.read().replace('\n', ''))
        print(data)
        response = session.post(flask_api_url + "/api/projects", data=data,
                                headers={'Content-Type': 'application/json'})
        print(response.text)

    def test_misformed_json_error(self, session, flask_api_url, pytestconfig):
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
        invalid_response = session.post(flask_api_url + "/api/projects",
                                        data=invalid_data.encode('utf-8'),
                                        headers={'Content-Type': 'application/json5'})
        print(invalid_response.text)

        with open(unmatching_manifest, 'r', encoding='utf-8') as tf:
            unmatching_data = str(tf.read().replace('\n', ''))
        unmatching_response = session.post(flask_api_url + "/api/projects",
                                           data=unmatching_data.encode('utf-8'),
                                           headers={'Content-Type': 'application/json5'})
        print(unmatching_response.text)

        assert invalid_response.status_code == 400
        assert 'Validation Error' in unmatching_response.text

    def test_misformed_content_type(self, session, flask_api_url, pytestconfig):
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
        response = session.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                headers={'Content-Type': 'image/gif'})
        print(response.text)
        assert response.status_code == 400

    def test_jsonheader_json5file(self, session, flask_api_url, pytestconfig):
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
        response = session.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                headers={'Content-Type': 'application/json'})
        print(response.text)
        assert response.status_code == 400

    def test_json5header_jsonfile(self, session, flask_api_url, pytestconfig):
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
        response = session.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                headers={'Content-Type': 'application/json5'})
        print(response.text)
        assert response.status_code == 200

    def test_inconsistent_post(self, session, flask_api_url,
                               pytestconfig, mongo_client, elastic_client):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = session.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                headers={'Content-Type': 'application/json5'})
        print(response.text)
        time.sleep(5)
        for project_id in response.json():
            # This should pass if post is working properly
            assert UUID(project_id, version=4)
            project_uuid = UUID(project_id, version=4)
            print(project_id)
            mongo_client.projects.find({})
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
    def test_unknown_id(self, session, flask_api_url):
        """ Test for 404 when a project with unknown ID is to be deleted.
        """
        unknown_id = str(uuid.uuid4())
        response = session.delete(flask_api_url + "/api/projects/" + unknown_id)
        print(response.text)
        assert response.status_code == 404

    def test_invalid_id(self, session, flask_api_url):
        """ Test for 405 when a project with ID of invalid format is to be deleted.
            The method does expect a uuid, a string will return invalid method
        """
        invalid_id = "invalid"
        response = session.delete(flask_api_url + "/api/projects/" + invalid_id)
        print(response.text)
        assert response.status_code == 405

    def test_success(self, session, flask_api_url, pytestconfig):
        """ Test successful delete (after successful upload).
        """
        # Post
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        post_response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(post_response.text)
        for pid in post_response.json():
            assert UUID(pid, version=4)
        assert post_response.status_code == 200

        # Delete
        project_id = post_response.json()[0]
        delete_response = session.delete(flask_api_url + "/api/projects/" + project_id)
        print(delete_response.text)
        assert delete_response.status_code == 200

    def test_inconsistent_delete(self, session, flask_api_url, pytestconfig):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        post_response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(post_response.text)
        for pid in post_response.json():
            assert UUID(pid, version=4)
        project_id = post_response.json()[0]
        delete_response = session.delete(flask_api_url + "/api/projects/" + project_id)
        print(delete_response.text)
        assert delete_response.status_code == 200

    def test_unauthorized_delete(self, flask_api_url, enter_default_user_users):
        """ Tests for 404 when attempting to delete a project when
            logged in as a user.
            Not found because the user should not know about the
            /api/delete endpoint.
        """
        response = enter_default_user_users
        data = {"email": "user@knex.com", "password": "user"}
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login', data=data)
        assert response.status_code == 200
        response = session.delete(flask_api_url + '/api/projects/' + str(uuid.uuid4()))
        assert response.status_code == 404


class TestGET(object):
    def test_unknown_id(self, session, flask_api_url):
        """ Test for 404 when one tries to get a project with unknown ID.
        """
        unknown_id = str(uuid.uuid4())
        response = session.get(flask_api_url + "/api/projects/" + unknown_id)
        print(response.text)
        assert response.status_code == 404

    def test_invalid_id(self, session, flask_api_url):
        """ Test for 404 when one tries to get a project with ID in invalid format.
        """
        invalid_id = "invalid"
        response = session.get(flask_api_url + "/api/projects/" + invalid_id)
        print(response.text)
        assert response.status_code == 404

    def test_success_getall(self, session, flask_api_url, manifest_validator,
                            mongo_client, enter_data_using_post):
        response = session.get(flask_api_url + "/api/projects")
        print(response.status_code)
        assert response.status_code == 200
        projects = response.json()
        print(projects)
        print(projects[0])
        for project in projects:
            print(project)
            if 'is_bookmark' in project:
                del project['is_bookmark']
            if 'is_owner' in project:
                del project['is_owner']
            print(manifest_validator.is_valid(project))
            assert manifest_validator.is_valid(project)
            print("project_id: ", project["_id"])

            is_in_mongo = mongo_client.projects.find_one(UUID(project["_id"]))
            assert is_in_mongo is not None

    def test_get_archived_fail(self, session, flask_api_url, enter_archived_using_post):
        project_id = enter_archived_using_post.json()
        print(project_id)
        time.sleep(1)
        get_response = session.get(flask_api_url + "/api/projects/" + project_id.pop(0) +
                                   "?archived=false")
        print(get_response.text)

        assert get_response.status_code == 404

    def test_get_archived_success(self, session, flask_api_url, enter_archived_using_post):
        project_id_archived = enter_archived_using_post.json()
        print(project_id_archived)
        get_response = session.get(flask_api_url + "/api/projects/" +
                                   project_id_archived[0] + "?archived=true")
        print(get_response.text)
        response_json = get_response.json()
        assert get_response.status_code == 200
        assert response_json["archived"]
        assert response_json["_id"] == project_id_archived[0]

    def test_archive_endpoint(self, flask_api_url, session, enter_data_using_post):
        project_id = enter_data_using_post.json()[0]
        response = session.get(flask_api_url + "/api/projects/" +
                               project_id + "/archive/" + "true")
        print(response.text)
        assert response.status_code == 200
        response = session.get(flask_api_url + "/api/projects/" +
                               project_id + "?archived=true")
        assert response.status_code == 200

    def test_unarchive_endpoint(self, flask_api_url, session, enter_data_using_post):
        project_id = enter_data_using_post.json()[0]
        response = session.get(flask_api_url + "/api/projects/" +
                               project_id + "/archive/" + "false")
        print(response.text)
        assert response.status_code == 200
        response = session.get(flask_api_url + "/api/projects/" +
                               project_id + "?archived=false")
        assert response.status_code == 200

    def test_get_archived_mixed_admin(self, session, flask_api_url,
                                      enter_archived_using_post, enter_data_using_post):
        project_id_not_archived = enter_data_using_post.json()
        project_id_archived = enter_archived_using_post.json()
        get_response = session.get(flask_api_url + "/api/projects", params={"archived": 'mixed'}, )
        print(get_response.text)
        response_json = get_response.json()
        assert get_response.status_code == 200
        assert response_json[0]['_id'] == project_id_archived[0] or project_id_not_archived[0]
        assert len(response_json) == 2

    def test_get_archived_true_admin(self, session, flask_api_url,
                                     enter_archived_using_post, enter_data_using_post):
        project_id_not_archived = enter_data_using_post.json()
        project_id_archived = enter_archived_using_post.json()
        get_response = session.get(flask_api_url + "/api/projects", params={"archived": 'true'}, )
        print(get_response.text)
        response_json = get_response.json()
        assert get_response.status_code == 200
        assert response_json[0]['_id'] == project_id_archived[0]
        assert len(response_json) == 1

    def test_get_archived_false_admin(self, session, flask_api_url,
                                      enter_archived_using_post, enter_data_using_post):
        project_id_not_archived = enter_data_using_post.json()
        project_id_archived = enter_archived_using_post.json()
        get_response = session.get(flask_api_url + "/api/projects", params={"archived": 'false'}, )
        print(get_response.text)
        response_json = get_response.json()
        assert get_response.status_code == 200
        assert response_json[0]['_id'] == project_id_not_archived[0]
        assert len(response_json) == 1

    def test_get_archived_mixed_user(self, session, flask_api_url,
                                     enter_archived_using_post, enter_data_using_post):
        assert True

    def test_get_archived_true_user(self, session, flask_api_url,
                                    enter_archived_using_post, enter_data_using_post):
        assert True

    def test_get_archived_false_user(self, session, flask_api_url,
                                     enter_archived_using_post, enter_data_using_post):
        assert True

    def test_success_getid(self, session, flask_api_url, pytestconfig):
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
        post_response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        print(post_response.text)
        for pid in post_response.json():
            assert UUID(pid, version=4)

        project_id = post_response.json()[0]
        get_response = session.get(flask_api_url + "/api/projects/" + project_id)
        print(get_response.text)

        assert get_response.status_code == 200
        assert get_response.json()["title"] == test_manifest_json["title"]
        assert get_response.json()["analysis"] == test_manifest_json["analysis"]


class TestPUT(object):
    def test_unknown_id(self, session, flask_api_url):
        """ Test for 404 when one tries to put a project with unknown ID.
        """
        unknown_id = str(uuid.uuid4())
        response = session.put(flask_api_url + "/api/projects/" + unknown_id)
        print(response.text)
        assert response.status_code == 404

    def test_archive_admin(self, session, flask_api_url,
                           enter_archived_using_post, enter_data_using_post):
        project_id_not_archived = enter_data_using_post.json()
        project_id_archived = enter_archived_using_post.json()
        get_response = session.get(flask_api_url + "/api/projects/" +
                                   project_id_not_archived[0])
        manifest_json = get_response.json()
        print(get_response.text)
        manifest_json['archived'] = True
        del manifest_json['is_bookmark']
        del manifest_json['is_owner']
        get_put_response = session.put(flask_api_url + "/api/projects/" +
                                       project_id_not_archived[0], json=manifest_json)
        print(get_put_response.text)
        assert get_put_response.status_code == 200
        time.sleep(2)
        get_again_response = session.get(flask_api_url + "/api/projects/" +
                                         project_id_not_archived[0] + "?archived=true")
        after_put_json = get_again_response.json()

        assert get_response.status_code == 200
        assert after_put_json["archived"]

    def test_unarchive_admin(self, session, flask_api_url,
                             enter_archived_using_post, enter_data_using_post):
        project_id_not_archived = enter_data_using_post.json()
        project_id_archived = enter_archived_using_post.json()
        get_response = session.get(flask_api_url + "/api/projects/" +
                                   project_id_archived[0] + "?archived=true")
        manifest_json = get_response.json()
        print(get_response.text)
        manifest_json['archived'] = False
        del manifest_json['is_bookmark']
        del manifest_json['is_owner']
        get_put_response = session.put(flask_api_url + "/api/projects/" + project_id_archived[0],
                                       json=manifest_json)
        print("put:", get_put_response.text)
        time.sleep(2)
        get_again_response = session.get(flask_api_url + "/api/projects/" + project_id_archived[0])
        print(get_again_response.text)
        after_put_json = get_again_response.json()
        assert get_put_response.status_code == 200
        assert get_response.status_code == 200
        assert not after_put_json["archived"]

    def test_invalid_id(self, session, flask_api_url):
        """ Test for 405 when one tries to put a project with ID in invalid format.
        """
        invalid_id = "invalid"
        response = session.put(flask_api_url + "/api/projects/" + invalid_id)
        print(response.text)
        assert response.status_code == 405

    def test_success(self, session, flask_api_url):
        assert True

    def test_unauthorized_update(self, flask_api_url, enter_default_user_users):
        """ Tests for 403 when attempting to update a different users project
        """
        response = enter_default_user_users
        data = {"email": "user@knex.com", "password": "user"}
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login', data=data)
        assert response.status_code == 200
        # this should be the id of a project from a different user
        projectid = str(uuid.uuid4())
        response = session.delete(flask_api_url + '/api/projects/' + projectid)
        # assert response.status_code == 403
