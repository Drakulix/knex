import os
import requests


class TestPOST(object):
    def test_setup(self, flask_api_url, session, enter_default_user_users,
                   enter_data_using_post, pytestconfig):
        sessionB = requests.Session()
        sessionB.post(flask_api_url + '/api/users/login',
                      data=dict(email='user@knex.com', password="user"))
        project_id = enter_data_using_post.json()[0]
        sessionB.post(flask_api_url + '/api/projects/' + project_id + '/comment',
                      data='new comment')
        notifications = sessionA.get(flask_api_url + '/api/users/notifications').json()
        assert notifications[-1] == '/project/' + project_id
