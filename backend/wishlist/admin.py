from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group 
from .models import User, Game, WishListItem 

# Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Game)
admin.site.register(WishListItem)
admin.site.unregister(Group)