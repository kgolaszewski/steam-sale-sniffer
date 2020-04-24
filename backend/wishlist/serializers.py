from rest_framework import serializers
from .models import Game, WishListItem 

class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Game 
        fields = ('title', 'steam_id', 'base_price', 'curr_price', 'users', 'id') 
        lookup_field = 'steam_id'

class WishListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WishListItem 
        fields = ('game', 'user', 'target_price')