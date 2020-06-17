# https://github.com/rpkilby/django-rest-framework-guardian
from rest_framework import permissions

class CustomObjectPermissions(permissions.DjangoObjectPermissions):
    """
    Similar to `DjangoObjectPermissions`, but adding 'view' permissions.
    """
    # perms_map = {
    #     'GET': ['%(app_label)s.view_%(model_name)s'],
    #     'OPTIONS': ['%(app_label)s.view_%(model_name)s'],
    #     'HEAD': ['%(app_label)s.view_%(model_name)s'],
    #     'POST': ['%(app_label)s.add_%(model_name)s'],
    #     'PUT': ['%(app_label)s.change_%(model_name)s'],
    #     'PATCH': ['%(app_label)s.change_%(model_name)s'],
    #     'DELETE': ['%(app_label)s.delete_%(model_name)s'],
    # }

    def has_permission(self, request, view):
        return True

    perms_map = {
        'GET':     ['wishlist.view_wishlistitem'],
        'OPTIONS': ['wishlist.view_wishlistitem'],
        'HEAD':    ['wishlist.view_wishlistitem'],
        'POST':    ['wishlist.add_wishlistitem'],
        'PUT':     ['wishlist.change_wishlistitem'],
        'PATCH':   ['wishlist.change_wishlistitem'],
        'DELETE':  ['wishlist.delete_wishlistitem'],
    }