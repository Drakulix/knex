from flask_security import current_user


def prepare_search_results(res):
    """ Internal function to prepare ElasticSearch search results to send as json.
    """
    projects = list(res)  # iterator compatibility
    for project in projects:
        project['is_bookmark'] = True if project.get('_id')\
            in current_user.bookmarks else False

    return projects
