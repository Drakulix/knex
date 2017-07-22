import requests
import os


class TestPOST(object):
    def setup(self):
        # app['TESTING'] = True
        # self.app = app.test_client()
        pass

    def test_main_page(self, session, flask_api_url):
        response = session.get(flask_api_url + '/')
        assert response.status_code == 200

    def test_login_fake_user(self,session, flask_api_url):
        session = requests.Session()
        response = session.post(flask_api_url + '/api/users/login',
                                 data=dict(email='user1', password='password'))

        assert response.reason == 'FORBIDDEN'
        assert response.status_code == 403

    def test_login_real_user(self,session, flask_api_url):
        response = session.post(flask_api_url + '/api/users/login',
                                 data=dict(email='admin@knex.com', password="admin"))
        assert response.reason == 'OK'
        assert response.status_code == 200

    def test_login_real_user_wrong_psswd(self,session, flask_api_url):
        response = session.post(flask_api_url + '/api/users/login',
                                 data=dict(email='admin', password='a'))
        assert response.reason == 'FORBIDDEN'
        assert response.status_code == 403

    def test_logout(self, flask_api_url,session):
        response = session.get(flask_api_url + '/api/users/login',
                                data=dict(email='user@knex.com', password="user"))
        response = session.get(flask_api_url + '/api/users/logout')
        assert response.reason == 'OK'
        assert response.status_code == 200

    def test_access_login_required_logged(self,session, pytestconfig, flask_api_url):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = session.post(flask_api_url + "/api/projects",
                                 data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json5'})

        assert response.status_code == 403

    def test_access_login_required_not_logged(self, session, pytestconfig, flask_api_url):
        response = session.get(flask_api_url + '/api/users/logout')
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = session.post(flask_api_url + "/api/projects",
                                 data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json5'})

        assert response.status_code == 403  # or 500?

    def test_get_user(self, session,  flask_api_url):
        response = session.get(flask_api_url + '/api/users/',
                                data=dict(email='user@knex.com'))
        assert response.status_code == 404  # 200?

    def test_update_user_nonexistent(self,session, flask_api_url):
        response = session.get(flask_api_url + '/api/users/',
                                data=dict(email='unknownuser@knex.com'))
        assert response.status_code == 404

