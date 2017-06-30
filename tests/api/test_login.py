import pytest
import requests


def test_login_unsuccessful(flask_api_url):
    """ Tests for 403 when the user data is wrong
    """
    data = {"email": "admin@knex.com", "password": "falsepassword"}
    response = requests.post(flask_api_url + '/api/users/login', data=data)
    assert response.status_code == 403


def test_login_successful(session, flask_api_url):
    """ Tests for 200 when the login data is correct
    """
    data = {"email": "admin@knex.com", "password": "admin"}
    response = session.post(flask_api_url + '/api/users/login', data=data)
    assert response.status_code == 200


def test_logout(flask_api_url):
    """ Tests for 200 when the login data is correct
        and 200 for logout afterwards.
    """
    data = {"email": "admin@knex.com", "password": "admin"}
    session = requests.Session()
    response = session.post(flask_api_url + '/api/users/login',
                            data=data)
    assert response.status_code == 200

    response = session.get(flask_api_url + '/api/users/logout')
    assert response.status_code == 200
    assert "Logged out" in response.text

def test_unauthorized_update(self, flask_api_url):
        """ Tests for 403 when attempting to update a different users project            
        """
        data = {"email": "user@knex.com", "password": "user"}
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login', data=data)
        assert response.status_code == 200
        # this should be the id of a project from a different user
        projectid = str(uuid.uuid4())
        response = session.delete(flask_api_url + '/api/projects/' + projectid)
        # assert response.status_code == 403
