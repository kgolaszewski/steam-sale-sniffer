from django.shortcuts import render
from rest_framework import viewsets 
from .serializers import GameSerializer, WishListItemSerializer
from .models import Game, WishListItem
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

# Create your views here.
class GameView(viewsets.ModelViewSet):
    serializer_class = GameSerializer
    queryset = Game.objects.all()
    lookup_field = 'steam_id'

class WishListItemView(viewsets.ModelViewSet):
    serializer_class = WishListItemSerializer
    queryset = WishListItem.objects.all()
