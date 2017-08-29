from flask_security import current_user


def prepare_search_results(res):
    """ Internal function to prepare ElasticSearch search results to send as json.
    """
    projects = list(res)  # iterator compatibility
    for project in projects:
        project['is_bookmark'] = 'true' if project.get('_id')\
            in current_user.bookmarks else 'false'
        project['is_owner'] = 'true' if current_user['email'] in project.get('authors')\
            else 'false'
    return projects
