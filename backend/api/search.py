from flask import request, jsonify, g, Blueprint, make_response
from elasticsearch.exceptions import RequestError
from flask_security import login_required, current_user
from mongoengine.fields import ObjectId
import json

from api.helper.apiexception import ApiException


search = Blueprint('api_projects_search', __name__)


def prepare_es_results(res):
    try:
        for hit in res['hits']['hits']:
            hit['_source']['_id'] = hit['_id']
        projects = [hit['_source'] for hit in res['hits']['hits']]
        for project in projects:
            project['is_bookmark'] = 'true' if project['_id']\
                in current_user['bookmarks'] else 'false'
            project['is_owner'] = 'true' if current_user['email']\
                in [author['email'] for author in project['authors']]\
                else 'false'
        return projects
    except KeyError as ke:
        raise ApiException(str(ke), 400)


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
    save = request.args.get('save', type=str)

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

    if save:
        del request_json['from']
        del request_json['size']

    try:
        projects = prepare_es_results(g.es.search(index="knexdb", body=request_json))
    except RequestError as e:
        raise ApiException(str(e), 400)

    if save:
        try:
            return g.save_search(current_user, json.loads(save), request_json, len(projects))
        except json.JSONDecodeError:
            return make_response('Invalid json', 400)
    else:
        return jsonify(projects)


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
    save = request.args.get('save', type=str)

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

    if save:
        del request_json['from']
        del request_json['size']

    try:
        projects = prepare_es_results(g.es.search(index="knexdb", body=request_json))
    except RequestError as e:
        raise ApiException(str(e), 400)

    if save:
        try:
            return g.save_search(current_user, json.loads(save), request_json, len(projects))
        except json.JSONDecodeError:
            return make_response('Invalid json', 400)
    else:
        return jsonify(projects)


@search.route('/api/projects/search/saved/<id>', methods=['GET'])
@login_required
def query_saved_search(id):
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    res = g.user_datastore.get_user(current_user['email'])
    for search in res.saved_searches:
        if search.saved_search_id == ObjectId(id):
            try:
                query = json.loads(search['query'])
                query['size'] = count
                query['from'] = offset
                projects = prepare_es_results(g.es.search(index="knexdb", body=query))
                return jsonify(projects)
            except RequestError as e:
                return (str(e), 400)
    return make_response("No search with the given id known", 404)


@search.route('/api/users/saved_searches', methods=['GET'])
@login_required
def get_saved_searches():
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)
    return jsonify([search.to_dict() for search in user.saved_searches])


@search.route('/api/users/saved_searches/<id>', methods=['DELETE'])
@login_required
def delete_saved_search(id):
    user = g.user_datastore.get_user(current_user['email'])
    if not user:
        raise ApiException("Couldn't find current_user in datastore", 500)

    for search in user.saved_searches:
        if search.saved_search_id == ObjectId(id):
            user.saved_searches.remove(search)
            user.save()
            return make_response("Success", 200)
    return make_response("No search with the given id known", 404)
