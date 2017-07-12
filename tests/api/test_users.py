class TestUsers(object):
    def test_update_usernames(self, flask_api_url, enter_users, session, enter_data_using_post):
        user = enter_users.json()
        document_id = enter_data_using_post.json()
        get_document_response = session.get(flask_api_url + "/api/projects/" + document_id[0])
        # update user
        document = get_document_response.json()
        del document['is_bookmark']
        del document['is_owner']
        updated_user = {'email': user['email'],
                        'name': user['first_name'] + " " + user['last_name']}
        document['authors'].append(updated_user)
        put_project_response = session.put(flask_api_url + "/api/projects/" +
                                           document_id[0], json=document)
        print(put_project_response.text)
        assert put_project_response.status_code == 200
        user['fist_name'] = "Dr. Dagobert"
        put_user_response = session.put(flask_api_url + "/api/users/" + user['email'], json=user)
        assert put_user_response.status_code == 200
        get_project_response = session.get(flask_api_url + "/api/projects/" + str(document["_id"]))
        print(get_project_response.text)
        # assert get_project_response.json()['authors'][]
        assert get_project_response.status_code == 200
