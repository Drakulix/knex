from flask_principal import Permission, PermissionDenied, RoleNeed
from flask_login import LoginManager
from flask_mongoengine import MongoEngine

global ADMIN_PERMISSION

ADMIN_PERMISSION = Permission(RoleNeed('admin'))
