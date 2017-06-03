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
