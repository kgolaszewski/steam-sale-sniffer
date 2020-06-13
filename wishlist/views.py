from django.shortcuts import render
from django.db.models import Q, F
from rest_framework import viewsets 
from .serializers import GameSerializer, WishListSerializer, WishListItemSerializer, UserSerializer
from .models import Game, WishListItem, User
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.pagination import PageNumberPagination, CursorPagination 

# class CursorSetPagination(CursorPagination):
#     page_number = 5
#     page_size_query_param = 'page_size'
#     ordering = '-timestamp'


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 1000

class GameView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()
    pagination_class = StandardResultsSetPagination 
    # lookup_field = 'steam_id'

class WishListItemView(viewsets.ModelViewSet):
    serializer_class = WishListItemSerializer
    queryset = WishListItem.objects.all()

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class WishListView(viewsets.ReadOnlyModelViewSet):
# class WishListView(viewsets.ModelViewSet):
    serializer_class = WishListSerializer 
    queryset = WishListItem.objects.all()#.order_by('game__title')
    pagination_class = StandardResultsSetPagination 

    def retrieve(self, request, pk=None):
        queryset = WishListItem.objects.filter(user_id=pk).filter(purchased=False).order_by(
            (F('game__curr_price')-F('target_price'))/F('target_price'), 'game__title'
        )
        serializer = WishListSerializer(queryset, many=True)
        return Response(serializer.data)

class CollectionView(viewsets.ReadOnlyModelViewSet):
# class CollectionView(viewsets.ModelViewSet):
    serializer_class = WishListSerializer 
    queryset = WishListItem.objects.all()
    pagination_class = StandardResultsSetPagination 

    def retrieve(self, request, pk=None):
        queryset = WishListItem.objects.filter(user_id=pk).filter(purchased=True).order_by(
            F('target_price')/F('game__curr_price'), 'game__title'
        )
        serializer = WishListSerializer(queryset, many=True)
        return Response(serializer.data)

# class SearchResultsView(viewsets.ModelViewSet):
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