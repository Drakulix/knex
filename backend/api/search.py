from flask import request, jsonify, g, Blueprint
from elasticsearch.exceptions import RequestError
from flask_security import login_required


search = Blueprint('api_projects_search', __name__)


@search.route('/api/projects/search/simple/', methods=['GET'])
@login_required
def search_simple():
    """Search projects

    Returns:
        res (json): JSON containing Projects and metadata

    """
    text = request.args.get("q", type=str)
    sorting = request.args.get('sort', type=str)
    order = request.args.get('order', type=str)
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    # ^2 is boosting the attribute, *_is allowing wildcards to be used
    request_json = {
        'query': {
            'multi_match': {
                'query': text,
                'fields': [
                    'tags^2',
                    'title^2',
                    'description',
                ],
            },
        },
        'from': offset,
        'size': count,
    }
    if (sorting is not None) and (order is not None):
        request_json["sort"] = dict()
        request_json["sort"][sorting] = {
            'order': order,
        }

    try:
        res = g.es.search(index="knexdb", body=request_json)
        try:
            for project in res:
                project['is_bookmark'] = 'true' if str(project['id'])\
                    in current_user['bookmarks'] else 'false'
                project['is_owner'] = 'true' if current_user['email']\
                    in [author['email'] for author in project['authors']]\
                    else 'false'
        except KeyError:
            pass
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@search.route('/api/projects/search/advanced/', methods=['GET'])
@login_required
def search_avanced():
    """Advanced search with filters

    Returns:
        res (json): JSON containing Projects and metadata

    """
    text = request.args.get("q", type=str)
    sorting = request.args.get('sort', type=str)
    order = request.args.get('order', type=str)
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    # string manipulation to get the user email if projects from a user were searched
    searchuser = False
    try:
        start = text.index('(authors.email: ') + len('(authors.email: ')
        end = text.index(')', start)
        usermail = text[start:end]
        searchuser = True
    except ValueError:
        pass

    request_json = {
        'query': {
            'query_string': {
                'query': text,
            },
        },
        'from': offset,
        'size': count,
    }
    if (sorting is not None) and (order is not None):
        request_json["sort"] = dict()
        request_json["sort"][sorting] = {
            'order': order,
        }
    try:
        res = g.es.search(index="knexdb", body=request_json)
        projects = res['hits'][:]
        try:
            for project in projects:
                project['is_bookmark'] = 'true' if str(project['id'])\
                    in current_user['bookmarks'] else 'false'
                project['is_owner'] = 'true' if current_user['email']\
                    in [author['email'] for author in project['authors']]\
                    else 'false'
        except KeyError:
            pass
        return jsonify(projects)
    except RequestError as e:
        return (str(e), 400)


@search.route('/api/projects/search/tag/', methods=['GET'])
@login_required
def search_tag():
    """Search projects

    Returns:
        res (json): JSON containing Projects and metadata
    """
    tag = request.args.get('q', type=str)
    sorting = request.args.get('sort', type=str)
    order = request.args.get('order', type=str)
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    request_json = {
        'query': {
            'bool': {
                'must': [
                    {
                        'match_phrase': {
                            'tags': tag,
                        },
                    },
                ],
            },
        },
        'from': offset,
        'size': count,
    }
    if (sorting is not None) and (order is not None):
        request_json["sort"] = dict()
        request_json["sort"][sorting] = {
            'order': order,
        }
    try:
        res = g.es.search(index="knexdb", body=request_json)
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@search.route('/api/projects/search/suggest/', methods=['GET'])
@login_required
def search_suggest():
    """Suggests search improvements

    Returns:
        res (json): JSON containing suggested search terms
    """
    text = request.args.get('q', type=str)

    request_json = {
        'suggest': {
            'text': text,
            'phraseSuggestion': {
                'phrase': {
                    'field': "description",
                    'highlight': {
                        'pre_tag': '<em>',
                        'post_tag': '</em>',
                    },
                    'direct_generator': [
                        {
                            'field': 'description',
                            'size': 10,
                            'suggest_mode': 'missing',
                            'min_word_length': 3,
                            'prefix_length': 2,
                        }
                    ],
                },
            },
        },
    }
    try:
        res = g.es.search(index="knexdb", body=request_json)
        return jsonify(res['suggest']['phraseSuggestion'][0]['options'])
    except RequestError as e:
        return (str(e), 400)
