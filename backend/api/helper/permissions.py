from flask_security import current_user
from flask import g


def current_user_has_permission_to_change(entry) -> bool:
    """Return boolean value if user has admin permission, arg->list with roles

        Returns:
            res: true if user has admin role
        """
    if current_user.has_role('admin'):
        return True
    elif 'email' in entry:
        return current_user['email'] == entry['email']
    elif 'author' in entry:
        return current_user['email'] == entry['author']
    return current_user['email'] in entry['authors']



def current_user_has_permission_to_change_project(project_id):
    """Return boolean value if user has admin permission, arg->list with roles

        Returns:
            res: true if user has admin role
        """
    if current_user.has_role('admin'):
        return True

    res = g.projects.find_one({'_id': project_id})
    return current_user['email'] in res['authors']
