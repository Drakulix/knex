from flask_principal import Permission, PermissionDenied, RoleNeed

__all__ = ['ADMIN_PERMISSION']

ADMIN_PERMISSION = Permission(RoleNeed('admin'))
