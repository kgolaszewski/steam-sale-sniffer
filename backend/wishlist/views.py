from django.shortcuts import render
from rest_framework import viewsets 
from .serializers import GameSerializer, WishListSerializer, WishListItemSerializer, UserSerializer
from .models import Game, WishListItem, User
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Create your views here.
class GameView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()
    # lookup_field = 'steam_id'

class WishListItemView(viewsets.ModelViewSet):
    serializer_class = WishListItemSerializer
    queryset = WishListItem.objects.all()

class UserView(viewsets.ModelViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()

class WishListView(viewsets.ReadOnlyModelViewSet):
    serializer_class = WishListSerializer 
    queryset = WishListItem.objects.all()

    def retrieve(self, request, pk=None):
        queryset = WishListItem.objects.filter(user_id=pk)
        # serializer = WishListItemSerializer(queryset, many=True)
        serializer = WishListSerializer(queryset, many=True)
        return Response(serializer.data)