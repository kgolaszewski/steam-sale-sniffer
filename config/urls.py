from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from wishlist import views
from .views import index

router = routers.DefaultRouter()
router.register(r'games', views.GameView, 'game')
router.register(r'wishlistitems', views.WishListItemView, 'wishlistitem')
router.register(r'wishlists', views.WishListView, 'wishlist')
router.register(r'collections', views.CollectionView, 'collection')
router.register(r'users', views.UserView, 'user')
router.register(r'search', views.SearchResultsView, 'search')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('api/', include(router.urls)),
    path('', index, name='index'),
]
