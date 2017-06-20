import requests
import unittest
import os



class TestSecurity(object):

    def setUp(self):
        # app['TESTING'] = True
        # self.app = app.test_client()
        pass

    def test_main_page(self,flask_api_url):
        response = requests.get(flask_api_url + '/')
        assert  response.status_code == 404

    def test_login_fake_user(self,flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login', data=dict(email='user1', password='password'))
        print(response)
        assert response.reason == 'Username oder Password invalid'
        assert response.status_code == 500

    def test_login_real_user(self,flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login',
                                 data=dict(email='admin@knex.com', password="admin"))
        assert response.reason == 'Login successful'
        assert response.status_code == 200

    def test_login_real_user_wrong_psswd(self,flask_api_url):
        response = requests.post(flask_api_url + '/api/users/login', data=dict(email='admin', password='a'))
        assert response.reason =='Username oder Password invalid'
        assert response.status_code == 500

    def test_logout(self,flask_api_url):
        response = requests.get(flask_api_url + '/api/users/login',
                                 data=dict(email='user@knex.com', password="user"))
        response = requests.get(flask_api_url + '/api/users/logout')
        assert response.reason == 'OK'
        assert response.status_code == 200

    def test_access_login_requiered_logged(self, pytestconfig,flask_api_url):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json5'})

        assert response.status_code == 200

    def test_access_login_requiered_not_logged(self, pytestconfig,flask_api_url):
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample0.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = requests.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                                 headers={'Content-Type': 'application/json5'})

        assert response.status_code == 200 #or 500?

    def test_update_user(self, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/', data=dict(email='user@knex.com'))
        assert response.status_code == 405 #200?

    def test_update_user_not_exists(self, flask_api_url):
        response = requests.get(flask_api_url + '/api/users/', data=dict(email='unknownuser@knex.com'))
        assert response.status_code == 405


'''
if __name__ == "__main__":
    unittest.main()

def test_unique_nickname(self):
    u = User(nickname='user1', email='user@knex.com')
    db.session.add(u)
    db.session.commit()
    nickname = User.make_unique_nickname('user1')
    assert nickname != 'john'
    u = User(nickname=user1, email='user@knex.com')
    db.session.add(u)
    db.session.commit()
    nickname2 = User.make_unique_nickname('user1')
    assert nickname2 != user1
    assert nickname2 != user1
'''
