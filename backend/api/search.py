from flask import request, jsonify, make_response, g, Blueprint
from elasticsearch.exceptions import RequestError

search = Blueprint('api_projects_search', __name__)


@search.route('/api/projects/search', methods=['POST'])
def search_direct():
    """Receive body of elasticsearch query

    Returns:
        res (json): Body of the Query
    """
    try:
        res = g.es.search(index="knexdb", body=request.get_json())
        return jsonify(res)
    except RequestError as e:
        return (str(e), 400)


@search.route('/api/projects/search/simple/', methods=['GET'])
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
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@search.route('/api/projects/search/advanced/', methods=['GET'])
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
        return jsonify(res['hits'])
    except RequestError as e:
        return (str(e), 400)


@search.route('/api/projects/search/tag/', methods=['GET'])
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
