from rest_framework import serializers
from rest_framework.authtoken.models import Token

from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin

from .models import Game, WishListItem, User

class TokenSerializer(serializers.ModelSerializer):
    class Meta:
        model = Token
        fields = ('key', 'user')
        
class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Game 
        fields = ('title', 'steam_id', 'base_price', 'curr_price', 'users', 'id') 

class ShortenedGameSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Game 
        fields = ('title', 'steam_id', 'curr_price', 'id') 

class UserSerializer(serializers.ModelSerializer):
    games = serializers.SlugRelatedField(many=True, read_only=True, slug_field='steam_id')

    def get_games(self, obj):
        serializer_data = GameSerializer(obj.game.filter(users__id__contains=id))
        games = serializer_data.get('steam_id')
        return {'games': games}

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'games')

# class WishListItemSerializer(serializers.ModelSerializer):
class WishListItemSerializer(ObjectPermissionsAssignmentMixin, serializers.ModelSerializer):
    class Meta:
        model  = WishListItem 
        fields = ('game', 'user', 'target_price', 'purchased', 'id')
    
    def get_permissions_map(self, created):
        # print(self.context)
        # print(vars(self.context['request']))
        current_user = self.context['request']._user

        return {
            'view_wishlistitem': [current_user],
            'change_wishlistitem': [current_user],
            'delete_wishlistitem': [current_user],
        }


class WishListSerializer(serializers.ModelSerializer):
    game = ShortenedGameSerializer()

    class Meta:
        model  = WishListItem 
        fields = ('game', 'target_price', 'purchased', 'id')
