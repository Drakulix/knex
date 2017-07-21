import requests
import unittest
import os


class Testsecurity(object):
    def setup(self):
        # app['TESTING'] = True
        # self.app = app.test_client()
        pass

    def test_main_page(self, flask_api_url):
        response = requests.get(flask_api_url + '/')
        assert response.status_code == 200

    def test_login_fake_user(self, flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login',
                                 data=dict(email='user1', password='password'))

        assert response.reason == 'Bad Request'
        assert response.status_code == 400

    def test_login_real_user(self, flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login',
                                 data=dict(email='admin@knex.com', password="admin"))
        assert response.reason == 'OK'
        assert response.status_code == 200

    def test_login_real_user_wrong_psswd(self, flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login',
                                 data=dict(email='admin', password='a'))
        assert response.reason == 'Bad Request'
        assert response.status_code == 400

    def test_logout(self, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/login',
                                data=dict(email='user@knex.com', password="user"))
        response = requests.get(flask_api_url + '/api/users/logout')
        assert response.reason == 'OK'
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

        assert response.status_code == 200

    def test_access_login_required_not_logged(self, pytestconfig, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/logout')
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

        assert response.status_code == 403  # or 500?

    def test_update_user(self, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/',
                                data=dict(email='user@knex.com'))
        assert response.status_code == 404  # 200?

    def test_update_user_nonexistent(self, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/',
                                data=dict(email='unknownuser@knex.com'))
        assert response.status_code == 404