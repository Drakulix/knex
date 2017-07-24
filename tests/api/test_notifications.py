import os
import requests


class TestPOST(object):
    def test_setup(self, flask_api_url, pytestconfig):
        sessionA = requests.Session()
        sessionB = requests.Session()
        sessionA.post(flask_api_url + '/api/users/login',
                      data=dict(email='admin@knex.com', password="admin"))
        sessionB.post(flask_api_url + '/api/users/login',
                      data=dict(email='user@knex.com', password="user"))
        test_manifest = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'validexample01.json5'
        )
        with open(test_manifest, 'r', encoding='utf-8') as tf:
            data = str(tf.read().replace('\n', ''))
        response = session.post(flask_api_url + "/api/projects",
                                data=data.encode('utf-8'),
                                headers={'Content-Type': 'application/json5'})
        project_id = str(response.json()[0])
        sessionB.post(flask_api_url + '/api/projects/' + project_id + '/comment',
                      data='new comment')
        notifications = sessionA.get(flask_api_url + '/api/users/notifications').json()
        assert notifications[-1] == '/project/' + project_id
