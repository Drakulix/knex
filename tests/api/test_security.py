import requests
import os


class TestPOST(object):
    def test_main_page(self, flask_api_url):
        response = requests.get(flask_api_url + '/')
        assert response.status_code == 404

    def test_login_fake_user(self, flask_api_url):
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login',
                                data=dict(email='user1', password='password'))
        assert response.status_code == 403

    def test_login_successful(self, flask_api_url):
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login',
                                data=dict(email='admin@knex.com', password="admin"))
        assert response.status_code == 200

    def test_login_wrong_password(self, flask_api_url):
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login',
                                data=dict(email='admin', password='a'))
        assert response.status_code == 403

    def test_logout(self, flask_api_url, session):
        session = requests.Session()
        session.post(flask_api_url + '/api/users/login',
                     data=dict(email='user@knex.com', password="user"))
        response = session.get(flask_api_url + '/api/users/logout')
        assert response.status_code == 200

    def test_access_login_required_logged(self, pytestconfig, flask_api_url):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects",
                                 data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json5'})
        assert response.status_code == 403

    def test_access_login_required_not_logged(self, pytestconfig, flask_api_url):
        requests.get(flask_api_url + '/api/users/logout')
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects",
                                 data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json5'})

        assert response.status_code == 403

    def test_get_user(self, session, enter_default_user_users, flask_api_url):
        response = enter_default_user_users
        assert response.status_code == 200
        response = session.get(flask_api_url + '/api/users/' + 'user@knex.com')
        assert response.status_code == 200

    def test_user_nonexistent(self, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/',
                                data=dict(email='unknownuser@knex.com'))
        assert response.status_code == 404
