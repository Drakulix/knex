import json
import os
import time
import uuid
import requests

from uuid import UUID


class TestPOST(object):
    projects_id=""

    def test_setup(self, flask_api_url, pytestconfig):
        session = requests.Session()
        session.post(flask_api_url + '/api/users/login',
                     data=dict(email='admin@knex.com', password="admin"))
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
        # assert (response.json()[0] == 33)
        projects_id = response.json()[0]
        session.post(
            flask_api_url + '/api/projects/' + projects_id + '/comment',
            data='new comment')
        user = session.get(
            flask_api_url + '/api/users/' + 'admin@knex.com').json()
        assert (
            user['notifications'] == '/project/' + projects_id)

