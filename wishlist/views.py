from django.shortcuts import render, get_object_or_404
from django.db.models import Q, F

from rest_framework import viewsets 
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination, CursorPagination 

# from guardian.mixins import PermisionRequiredMixin
# from rest_framework_guardians import filters

from .serializers import GameSerializer, WishListSerializer, WishListItemSerializer, UserSerializer
from .models import Game, WishListItem, User
from .permissions import CustomObjectPermissions

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000


# Writable ModelViewSets

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class GameView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()
    pagination_class = StandardResultsSetPagination 

# class WishListItemView(PermissionRequiredMixin, viewsets.ModelViewSet):
class WishListItemView(viewsets.ModelViewSet):
    serializer_class = WishListItemSerializer
    queryset = WishListItem.objects.all()
    # permission_classes = [CustomObjectPermissions]
    # filter_backends = [filters.ObjectPermissionsFilter]



# ReadOnlyModelViewSets 

# Less certain that PermissionRequiredMixin will work in these shortened Serializer contexts 
# No reference points in documentation

# class WishListView(PermissionRequiredMixin, viewsets.ReadOnlyModelViewSet):
class WishListView(viewsets.ReadOnlyModelViewSet):
    serializer_class = WishListSerializer 
    queryset = WishListItem.objects.all()
    pagination_class = StandardResultsSetPagination 

    # permission_classes = [CustomObjectPermissions]
    # filter_backends = [filters.ObjectPermissionsFilter]

    def retrieve(self, request, pk=None):
        queryset = WishListItem.objects.filter(user_id=pk).filter(purchased=False).order_by(
            (F('game__curr_price')-F('target_price'))/F('target_price'), 'game__title'
        )
        serializer = WishListSerializer(queryset, many=True)
        return Response(serializer.data)

# class CollectionView(PermissionRequiredMixin, viewsets.ReadOnlyModelViewSet):
class CollectionView(viewsets.ReadOnlyModelViewSet):
    serializer_class = WishListSerializer 
    queryset = WishListItem.objects.all()
    pagination_class = StandardResultsSetPagination 

    # permission_classes = [CustomObjectPermissions]
    # filter_backends = [filters.ObjectPermissionsFilter]

    def retrieve(self, request, pk=None):
        queryset = WishListItem.objects.filter(user_id=pk).filter(purchased=True).order_by(
            F('target_price')/F('game__base_price'), 'game__title'
        )
        serializer = WishListSerializer(queryset, many=True)
        return Response(serializer.data)

class SearchResultsView(viewsets.ReadOnlyModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()
    pagination_class = StandardResultsSetPagination 

    def get_queryset(self):
        query = self.request.GET.get('q')
        object_list = Game.objects.filter(
            Q(title__icontains=query)
        )
        return object_list