import json

from flask import request, jsonify, g, Blueprint, make_response
from elasticsearch.exceptions import RequestError
from flask_security import login_required, current_user
from mongoengine.fields import ObjectId

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


@search.route('/api/projects/search', methods=['POST'])
@login_required
def search_api():
    """Search function

    Returns:
        res (json): JSON containing Projects and metadata

    """

    query = request.get_json()

    search_string = query.get('searchString', '')
    archived = query.get('archived')
    authors = query.get('authors')
    tags = query.get('tags')
    status = query.get('status')
    date_from = query.get('date_from')
    date_to = query.get('date_to')
    description = query.get('description')
    title = query.get('title')

    request_json = {
        'query': {
            'bool': {
                'should': {
                    'multi_match': {
                        'query': search_string,
                        'fields': [
                            'tags^2',
                            'title^2',
                            'description',
                        ],
                    }
                },
                'filter': {
                    'bool': {
                        'must': []
                    }
                }
            }
        }
    }

    if authors:
        for author in authors:
            request_json['query']['bool']['filter']['bool']['must'].append({
                'term': {'authors': author}
                })

    if tags:
        for tag in tags:
            request_json['query']['bool']['filter']['bool']['must'].append({
                'term': {'tags': tag}
            })

    if status:
        request_json['query']['bool']['filter']['bool']['must'].append({
            'term': {'status': status.lower()}
        })

    if archived:
        request_json['query']['bool']['filter']['bool']['must'].append({
            'term': {'archived': archived in ['true', 'True', '1', 'yes', 'y']}
        })

    if date_from or date_to:
        date_filter = {
            'range': {'date_creation': {}}
        }

        if date_from:
            date_filter['range']['date_creation']['gte'] = date_from
        if date_to:
            date_filter['range']['date_creation']['lte'] = date_to

        request_json['query']['bool']['filter']['bool']['must'].append(date_filter)

    if description:
        request_json['query']['bool']['filter']['bool']['must'].append({
            'wildcard': {'description': '*' + description + '*'}
        })

    if title:
        request_json['query']['bool']['filter']['bool']['must'].append({
            'wildcard': {'title': '*' + title + '*'}
        })

    try:
        projects = prepare_es_results(g.es.search(index="knexdb", body=request_json))
    except RequestError as e:
        raise ApiException(str(e), 400)

    if 'label' in query:
        try:
            return g.save_search(current_user, query, request_json, len(projects))
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
