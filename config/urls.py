from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import routers
from wishlist import views
from .views import index

router = routers.DefaultRouter()
router.register(r'games', views.GameView, 'game')
router.register(r'wishlistitems', views.WishListItemView, 'wishlistitem')
router.register(r'wishlists', views.WishListView, basename='wishlist')
router.register(r'collections', views.CollectionView, basename='collections')
# router.register(r'users', views.UserView, 'user')
router.register(r'search', views.SearchResultsView, 'search')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('rest-auth/registration/', include('rest_auth.registration.urls')),
    path('api/', include(router.urls)),
    re_path(r'^.*', index, name='index'),
]

# urlpatterns += [
#     path('django-rq/', include('django_rq.urls'))
# ]

