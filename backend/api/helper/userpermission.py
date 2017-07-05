def is_permitted(roles):
    """Return boolean value if user has admin permission, arg->list with roles

        Returns:
            res: true if user has admin role
        """
    for role in roles:
        if(role.name == 'admin'):
            return True

    return False
