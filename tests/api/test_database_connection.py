import time
import os
import json
import uuid
import requests
import docker

from uuid import UUID


def test_no_mongo(flask_api_url, docker_client):
    # TODO
    assert True


def test_no_elastic(flask_api_url, docker_client):
    # TODO
    assert True


def test_consistent_delete_no_elastic(session, flask_api_url, pytestconfig, elastic_client):
    """Test if mongo-connector resyncs when elasticsearch is shortly down.
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
    for id in post_response.json():
        assert UUID(id, version=4)
    project_id = post_response.json()[0]

    client = docker.from_env()

    # Not the best way to get the container but every time I try getting it otherwise
    # it didn't work?
    container = None
    for x in client.containers.list():
        if "elastic" in x.attrs['Config']['Image']:
            container = x
    if container is None:
        print("Couldn't find elasticsearch container!")
        assert False

    container.kill()

    delete_response = session.delete(flask_api_url + "/api/projects/" + project_id)
    print(delete_response.text)
    assert delete_response.status_code == 200

    container.start()

    time.sleep(50)
    # to give elasticsearch and mongo-connector some time to get back to normal

    es_d_result = elastic_client.get(index="knexdb", id=project_id, ignore=404)
    print("es: ", es_d_result)
    assert not es_d_result['found']


def test_empty_database(flask_api_url, mongo_client):
    """
    :param flask_api_url:
    :param mongo_client:
    :return:
    """
    result = mongo_client.projects.delete_many({})
    print("Database cleaned: ", result)
    response = requests.get(flask_api_url + "/api/projects")
    assert response.status_code == 200
    print(response.text)


def test_consistency(mongo_client, elastic_client):
    """Test if mongo-connector makes sure mongo and elasticsearch are consistent.
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


def test_consistent_delete(flask_api_url, mongo_client, elastic_client, session):
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
    delete_response = session.delete(flask_api_url + "/api/projects/" + str(project_id))
    print(delete_response.text)
    assert delete_response.status_code == 200

    # wait for the refreshed elastic database
    time.sleep(5)
    es_d_result = elastic_client.get(index="knexdb", id=project_id, ignore=404)
    assert not es_d_result['found']
