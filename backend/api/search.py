""" Module search defines the web servers /api/search routes which
    provide all sort of (elastic)search-related functionality.
"""

import json

from flask import request, jsonify, g, Blueprint, make_response
from flask_security import login_required, current_user
from mongoengine.fields import ObjectId
from uuid import UUID

from api.helper.apiexception import ApiException
from api.helper.search import prepare_search_results, prepare_mongo_query

from whoosh.query import Term

from storage.projects import get_stored_projects


search = Blueprint('api_projects_search', __name__)


@search.route('/api/projects/search', methods=['POST'])
@login_required
def search_es():
    """Search function

    Returns:
        res (json): JSON containing Projects and metadata

    """
    request_json = request.get_json()
    query = prepare_mongo_query(request_json)

    if request_json.get('searchString'):
        search_String = request_json.get('searchString')
        with g.whoosh_index.searcher() as searcher:
            ids = [result for result in searcher.search(Term("content", search_String))]

    if 'label' in query:
        try:
            return g.save_search(current_user, request_json, len(projects))
        except json.JSONDecodeError:
            return make_response('Invalid json', 400)
    else:
        projects = get_stored_projects(query)
        return jsonify(projects)


@search.route('/api/projects/search/count', methods=['POST'])
@login_required
def search_count():
    """Search function

    Returns:
        res (json): JSON containing number of matches

    """
    query = request.get_json()
    request_json = prepare_mongo_query(query)

    try:
        res = g.projects.find(request_json, {'comments': 0})
        return jsonify(res)
    except Exception as err:
        raise ApiException(str(err), 400)


@search.route('/api/projects/search/saved/<id>', methods=['GET'])
@login_required
def query_saved_search(id):
    """ Queries a saved search of the current_user with <id>

        Returns: Search results.
    """
    offset = request.args.get('offset', type=int)
    if offset is None:
        offset = 0
    count = request.args.get('count', type=int)
    if count is None:
        count = 10

    for cursearch in current_user.saved_searches:
        if cursearch.saved_search_id == ObjectId(id):
            try:
                query = json.loads(cursearch['query'])
                query['size'] = count
                query['from'] = offset
                projects = prepare_search_results(g.projects.find(query, {'comments': 0}))
                return jsonify(projects)
            except RequestError as reqerr:
                return (str(reqerr), 400)
    return make_response("No search with the given id known", 404)


@search.route('/api/projects/ngramlist/<ngrams>', methods=['GET'])
@login_required
def get_autocomplete_ngrams(ngrams):
    return jsonify([ngrams])


@search.route('/api/users/saved_searches', methods=['GET'])
@login_required
def get_saved_searches():
    """ Returns the saved searches for the current user.
    """
    return jsonify([search.to_dict() for search in current_user.saved_searches])


@search.route('/api/users/saved_searches/<id>', methods=['DELETE'])
@login_required
def delete_saved_search(id):
    """ Deletes the saved search with <id> from the current_users saved searches.
    """
    for cursearch in current_user.saved_searches:
        if cursearch.saved_search_id == ObjectId(id):
            current_user.saved_searches.remove(cursearch)
            current_user.save()
            return make_response("Success", 200)
    return make_response("No search with the given id known", 404)
