from flask_principal import Permission, PermissionDenied, RoleNeed

ADMIN_PERMISSION = Permission(RoleNeed('admin'))
