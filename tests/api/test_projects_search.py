import time
import os
import json
import requests

from uuid import UUID


class TestPOST(object):

    def test_success_search(self, flask_api_url, session, pytestconfig):
        """Post a search query and verify result.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample2.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        for id in response.json():
            assert UUID(id, version=4)
            project_id = id

        time.sleep(5)

        searchquery = json.dumps({
            "query": {
                "bool": {
                    "must": [
                        {
                            "query_string": {
                                "query": "superawesometitle",
                                "fields": [
                                    "description", "title", "tags"
                                ]
                            }
                        }
                    ]
                }
            }
        })

        search_response = session.post(flask_api_url + "/api/projects/search", data=searchquery)
        results = json.loads(search_response.text)

        found = False
        for project in results['hits']['hits']:
            print("%s, title: %s, tags: %s" % (project['_id'], project['_source'][
                  'title'], ', '.join(map(str, project['_source']['tags']))))
            if project['_id'] == project_id:
                found = True
        print("ID of uploaded project: ", project_id)
        assert found

    def test_no_success_search(self, flask_api_url, session, pytestconfig):
        """Post a search query which should match none.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample2.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        for id in response.json():
            assert UUID(id, version=4)
            project_id = id

        time.sleep(5)

        searchquery = json.dumps({
            "query": {
                "match_none": {}
            }
        })

        search_response = session.post(flask_api_url + "/api/projects/search", data=searchquery)
        results = json.loads(search_response.text)

        found = False
        for project in results['hits']['hits']:
            print("%s, title: %s, tags: %s" % (project['_id'], project['_source'][
                  'title'], ', '.join(map(str, project['_source']['tags']))))
            if project['_id'] == project_id:
                found = True
        print("ID of uploaded project: ", project_id)
        assert not found


class TestGET(object):

    def test_success_simplesearch(self, flask_api_url, session, pytestconfig):
        """Test if simple search is successful
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample2.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        for id in response.json():
            assert UUID(id, version=4)
            project_id = id

        time.sleep(5)

        response = session.get(
            flask_api_url + "/api/projects/search/simple/?q=superawesometitle&sort=desc&offset=0")
        print(response.text)
        assert "superawesometitle" in response.text

    def test_success_tag(self, flask_api_url, session, pytestconfig):
        """Test if advanced search for tag is successful.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample2.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        for id in response.json():
            assert UUID(id, version=4)
            project_id = id

        time.sleep(5)

        response = session.get(
            flask_api_url + "/api/projects/search/advanced/?q=tags:superawesometag&sort=desc")
        resulttags = json.loads(response.text)["hits"][0]['_source']['tags']
        print("tags of result:", resulttags)
        assert "superawesometag" in resulttags

    def test_no_success_tag(self, flask_api_url, session, pytestconfig):
        """Test if search for non-existent tag (but existent title) is unsuccessful.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample2.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        for id in response.json():
            assert UUID(id, version=4)
            project_id = id

        time.sleep(5)

        response = session.get(
            flask_api_url + "/api/projects/search/advanced/?q=tags:superawesometitle&sort=desc")
        result = json.loads(response.text)
        print("result: ", result)
        assert result['total'] == 0

    def test_success_author(self, flask_api_url, pytestconfig, session):
        """Test if search for existent author is successful.
        """
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample2.json'
        )
        with open(test_manifest, 'r') as tf:
            test_manifest_json = json.load(tf)
        response = session.post(flask_api_url + "/api/projects", json=test_manifest_json)
        for id in response.json():
            assert UUID(id, version=4)
            project_id = id

        time.sleep(5)

        response = session.get(flask_api_url + "/api/projects/search/advanced/" + 
                               "?q=authors.name:superawesomeauthor&sort=desc")
        resultauthors = json.loads(response.text)['hits'][0]['_source']['authors'][0]['name']
        print("authors of result:", resultauthors)
        assert "superawesomeauthor" in resultauthors
