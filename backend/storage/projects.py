import time
from datetime import datetime, timezone
from flask import g
from flask_security import current_user

from pymongo.collection import ReturnDocument
from api.notifications import add_notification, add_self_action, delete_project_notification
from api.helper import uploader
from api.projectsMeta import init_project_meta, set_last_access
from api.projectsMeta import delete_project_meta, set_updated_fields


def project_exists(project_id):
    return g.projects.find_one({'_id': project_id}) is not None


def delete_stored_project(project_id):
    g.projects.delete_one({'_id': project_id})
    g.whoosh_index.delete_by_term('id', str(project_id))
    delete_project_notification(project_id)
    delete_project_meta(project_id)
    g.rerun_saved_searches(current_user['email'], project_id, "delete")
    g.on_project_deletion(project_id)


def get_stored_project(project_id):
    res = g.projects.find_one({'_id': project_id}, {'comments': 0})
    set_last_access(project_id, str(datetime.now(timezone.utc)))
    return res


def update_stored_project(project_id, manifest):
    res = g.projects.find_one({'_id': project_id})
    changedfields = []
    for field in res:
        if field in manifest and not res[field] == manifest[field]:
            res[field] = manifest[field]
            changedfields.append(field)
    if g.validator.is_valid(res) and len(changedfields) > 1:
        res['date_last_updated'] = time.strftime("%Y-%m-%d")
        changedfields.append('date_last_updated')
        res['_id'] = project_id
        res['authors'] = sorted(list(set(res['authors'])))
        res['tags'] = sorted(res['tags'])
        g.projects.find_one_and_replace({'_id': project_id}, res,
                                        return_document=ReturnDocument.AFTER)
        set_updated_fields(project_id, changedfields, str(datetime.now(timezone.utc)))
        writer = g.whoosh_index.writer()
        writer.update_document(ngrams=res['description'], content=res['description'],
                               id=str(res['_id']))
        writer.commit()
        add_notification(current_user['email'], manifest['authors'], "update",
                         project_id=project_id, reason='author')
        add_notification(current_user['email'], g.users_with_bookmark(project_id), "update",
                         project_id=project_id, reason='bookmark')
        add_notification(current_user['email'],
                         [comment['author'] for comment in res['comments']], "update",
                         project_id=project_id, reason='comment')
        add_self_action(current_user['email'], "update", project_id=project_id)
        g.rerun_saved_searches(current_user['email'], project_id, "update")
        return True
    elif len(changedfields) == 1:
        return True
    else:
        return False


def archive_stored_project(project_id, req):
    res = g.projects.find_one({'_id': project_id})
    res['archived'] = req['archived']
    operation = 'archive' if req['archived'] == 'true' else 'unarchive'
    g.projects.find_one_and_replace({'_id': project_id}, res,
                                    return_document=ReturnDocument.AFTER)
    res['date_last_updated'] = time.strftime("%Y-%m-%d")
    res['_id'] = project_id
    g.projects.find_one_and_replace({'_id': project_id}, res,
                                    return_document=ReturnDocument.AFTER)
    add_notification(current_user['email'], res['authors'], operation,
                     project_id=project_id, reason='author')
    add_notification(current_user['email'], g.users_with_bookmark(project_id), operation,
                     project_id=project_id, reason='bookmark')
    add_notification(current_user['email'],
                     [comment['author'] for comment in res['comments']], operation,
                     project_id=project_id, reason='comment')
    add_self_action(current_user['email'], operation, project_id=project_id)
    g.rerun_saved_searches(current_user['email'], project_id, operation)


def add_project_list(manifestlist):
    projects = uploader.save_manifest_to_db(manifestlist)
    for project in projects:
        if 'comments' not in project:
            project['comments'] = []
        g.projects.insert(project)
        init_project_meta(project['_id'], str(datetime.now(timezone.utc)))
        writer = g.whoosh_index.writer()
        writer.add_document(ngrams=project['description'],
                            content=project['description'],
                            id=str(project['_id']))
        writer.add_document(spelling=project['description'])
        writer.commit()
        add_notification(current_user['email'], project['authors'], "create",
                         project_id=project['_id'], reason='author')
        add_self_action(current_user['email'], "create", project_id=project['_id'])
        g.rerun_saved_searches(current_user['email'], project['_id'], "create")
    return [project['_id'] for project in projects]
