import time
import uuid
import requests


def test_no_mongo(flask_api_url, docker_client):
    # TODO
    assert True


def test_no_elastic(flask_api_url, docker_client):
    # TODO
    assert True


def test_empty_database(flask_api_url):
    """Sample test."""
    response = requests.get(flask_api_url + "/api/projects")
    assert response.text == "There are no projects"
    # response.raise_for_status()

    print(response.text)


def test_consistency(mongo_client, elastic_client):
    project_id = uuid.uuid4()
    dummy_project = {"_id": project_id, "name": "dummy_file"}
    mongo_client.projects.insert_one(dummy_project)
    mongo_result = mongo_client.projects.find_one(project_id)
    print("mongo:", mongo_result)
    # Test if document is in mongo
    assert mongo_result == dummy_project
    # wait for the refreshed elastic database
    time.sleep(5)
    # test if document is in es
    # print es indices ( for easier debugging)
    for index in elastic_client.indices.get('*'):
        print(index)

    es_result = elastic_client.get(index="knexdb", id=project_id)
    print("es:", es_result)
    assert es_result['found']


def test_consistent_delete(flask_api_url, mongo_client, elastic_client):
    """ Test whether files deleted in mongodb also get deleted in elasticsearch.
    """
    project_id = uuid.uuid4()
    dummy_project = {"_id": project_id, "name": "dummy_file"}
    mongo_client.projects.insert_one(dummy_project)
    mongo_result = mongo_client.projects.find_one(project_id)
    print("mongo:", mongo_result)
    # Test if document is in mongo
    assert mongo_result == dummy_project
    # wait for the refreshed elastic database
    time.sleep(5)
    # test if document is in es
    # print es indices ( for easier debugging)
    for index in elastic_client.indices.get('*'):
        print(index)

    es_result = elastic_client.get(index="knexdb", id=project_id)
    print("es:", es_result)
    assert es_result['found']

    # delete from mongo and check es
    delete_response = requests.delete(flask_api_url + "/api/projects/" + str(project_id))
    print(delete_response.text)
    assert delete_response.status_code == 200

    # wait for the refreshed elastic database
    time.sleep(5)
    es_d_result = elastic_client.get(index="knexdb", id=project_id, ignore=404)
    assert not es_d_result['found']
