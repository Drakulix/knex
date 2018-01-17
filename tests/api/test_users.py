import os


class TestUsers(object):
    def test_update_usernames(self, flask_api_url, enter_users, session, enter_data_using_post):
        user = enter_users.json()
        document_id = enter_data_using_post.json()
        get_document_response = session.get(flask_api_url + "/api/projects/" + document_id[0])
        # update user
        document = get_document_response.json()
        del document['is_bookmark']
        document['authors'].append("user@knex.com")
        put_project_response = session.put(flask_api_url + "/api/projects/" +
                                           document_id[0], json=document)
        print(put_project_response.text)
        assert put_project_response.status_code == 200
        user['first_name'] = "Dr. Dagobert"
        put_user_response = session.put(flask_api_url + "/api/users", json=user)
        print(put_user_response.text)
        assert put_user_response.status_code == 200
        get_project_response = session.get(flask_api_url + "/api/projects/" + str(document["_id"]))
        print(get_project_response.text)
        assert get_project_response.status_code == 200

    def test_update_user_roles(self, flask_api_url, enter_default_user_users, session):
        response = session.put(flask_api_url + "/api/users",
                               json={"email": "user@knex.com", "roles": ["user", "admin"]})
        assert response.status_code == 200
        response = session.put(flask_api_url + "/api/users",
                               json={"email": "user@knex.com", "roles": ["user"]})
        assert response.status_code == 200

    def test_avatar_upload(self, session, flask_api_url, pytestconfig):
        test_avatar = os.path.join(
            str(pytestconfig.rootdir),
            'tests',
            'testmanifests',
            'exampleavatar.png'
        )
        with open(test_avatar, 'rb') as tf:
            response = session.post(flask_api_url + "/api/users/admin@knex.com/avatar",
                                    files={'file': ('exampleavatar.png', tf, 'image/png')})
        print(response.text)
        assert response.status_code == 200

    def test_avatar_get(self, session, flask_api_url):
        response = session.get(flask_api_url + "/api/users/admin@knex.com/avatar")
        assert response.status_code == 200

    def test_avatar_delete(self, session, flask_api_url):
        response = session.delete(flask_api_url + "/api/users/admin@knex.com/avatar")
        assert response.status_code == 200
