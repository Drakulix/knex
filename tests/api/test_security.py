import os
import requests


class TestGET(object):

    def test_main_page(self, flask_api_url):
        response = requests.get(flask_api_url + '/')
        assert response.status_code == 200

    def test_unknown_user(self, session, flask_api_url):
        response = session.get(flask_api_url + '/api/users' + 'unknownuser@knex.com')
        assert response.status_code == 400

    def test_user(self, session, flask_api_url):
        response = session.get(flask_api_url + '/api/users' + 'user@knex.com')
        assert response.status_code == 200


class TestPOST(object):

    def test_login_logout(self, flask_api_url):
        """ Tests for 200 when the login data is correct
        and 200 for logout afterwards.
        """
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login',
                                data=dict(email='user@knex.com', password='user'))
        assert response.status_code == 200
        response = session.get(flask_api_url + '/api/users/logout')
        assert response.status_code == 200

    def test_login_fake_user(self, flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login',
                                 data=dict(email='user1', password='password'))
        assert response.status_code == 403

    def test_login_wrong_password(self, flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login',
                                 data=dict(email='admin', password='a'))
        assert response.status_code == 403

    def test_project_not_logged_in(self, pytestconfig, flask_api_url):
        session = requests.Session()
        response = session.get(flask_api_url + '/api/users/logout')
        assert response.status_code == 200
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
        assert response.status_code == 404
