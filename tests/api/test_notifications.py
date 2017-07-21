import json
import os
import time
import uuid
import requests

from uuid import UUID


class Test_notifications(object):
    def test_project_notification(self, session, flask_api_url, pytestconfig):
        # login first
        requests.post(flask_api_url + '/api/users/login',
                      data=dict(email='admin@knex.com', password="admin"))
        # add some project and save id
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
        projects_id = response.json()[0]
        # assert(response.json()== 33)
        requests.post(
            flask_api_url + '/api/projects/' + projects_id + '/comment',
            data='new comment')
        requests.get(flask_api_url + '/api/users/logout')
        requests.post(flask_api_url + '/api/users/login',
                      data=dict(email='user@knex.com', password="user"))
        user_notifications = requests.get(
            flask_api_url + '/api/users/notifications').json()
        assert (
            user_notifications['link'] == '/project/' + projects_id)
