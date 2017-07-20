import json
import os
import time
import uuid
import requests

from uuid import UUID

projects_ids = []
comment_id = ""


def set_up(self, flask_api_url, pytestconfig):
    # login first
    requests.post(flask_api_url + '/api/users/login',
                  data=dict(email='admin@knex.com', password="admin"))
    # add some project and save id
    test_manifest = os.path.join(
        str(pytestconfig.rootdir),
        'tests',
        'testmanifests',
        'validexample1.json5'
    )
    with open(test_manifest, 'r', encoding='utf-8') as tf:
        data = str(tf.read().replace('\n', ''))
    response = requests.post(flask_api_url + "/api/projects", data=data.encode('utf-8'),
                            headers={'Content-Type': 'application/json5'})
    print(response.text)
    for pid in response.json():
        projects_ids.append(pid)


def test_project_notification(self, flask_api_url):
    requests.post(
        flask_api_url + '/api/projects/' + projects_ids[0] + '/comment',
        data='new comment')
    requests.get(flask_api_url + '/api/users/logout')
    requests.post(flask_api_url + '/api/users/login',
                  data=dict(email='user@knex.com', password="user"))
    user_notifications = requests.get(flask_api_url + '/api/users/notifications')
    assert (user_notifications['link'] == flask_api_url + '/project/' + projects_ids[0])
