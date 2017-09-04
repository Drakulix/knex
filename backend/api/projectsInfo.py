from flask import request, jsonify,  g, Blueprint
from flask_security import login_required

from uuid import UUID


projects_info = Blueprint('api_projects_info', __name__)


@projects_info.route('/api/projects/authors', methods=['GET'])
@login_required
def get_all_authors():
    """ Returns a list of all email adresses used in projects "authors" field.
    """
    try:
        authors = g.projects.distinct('authors')
        all_authors = sorted(authors, key=lambda k: str(k).lower()) if authors else []
        return jsonify(all_authors)
    except Exception as err:
        raise ApiException(str(err), 500)


@projects_info.route('/api/projects/tags', methods=['GET'])
@login_required
def get_all_tags():
    """ Returns a list of all tags used in projects "tags" field.
    """
    try:
        tags = g.projects.distinct('tags')
        return jsonify(sorted(tags, key=str.lower))
    except Exception as err:
        raise ApiException(str(err), 500)
