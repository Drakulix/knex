from flask_security import current_user


def prepare_search_results(res):
    """ Internal function to prepare ElasticSearch search results to send as json.
    """
    projects = list(res)  # iterator compatibility
    for project in projects:
        project['is_bookmark'] = True if project.get('_id')\
            in current_user.bookmarks else False
    return projects


def prepare_mongo_query(query):
    """ Internal function to prepare the ElasticSearch search query from a given json
    """
    archived = query.get('archived')
    authors = query.get('authors')
    tags = query.get('tags')
    status = query.get('status')
    date_from = query.get('date_from')
    date_to = query.get('date_to')
    description = query.get('description')
    title = query.get('title')

    request_json = {}

    if authors:
        request_json['authors'] = {'$all': authors}
    if tags:
        request_json['tags'] = {'$all': tags}
    if status:
        request_json['status'] = status
    if archived in ['true', 'false']:
        request_json['archived'] = archived
    if date_from:
        request_json['date_creation'] = {'$gte': date_from}
    if date_to:
        request_json['date_creation'] = {'$lte': date_to}
    if description:
        request_json['description'] = {'$regex': '(^| )' + description, '$options': 'i'}
    if title:
        request_json['title'] = {'$regex': '(^| )' + title, '$options': 'i'}

    return request_json
