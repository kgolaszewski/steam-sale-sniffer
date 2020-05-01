from rest_framework import serializers
from .models import Game, WishListItem, User
from rest_framework import serializers
from rest_framework.authtoken.models import Token

# from allauth.account.adapter import get_adapter
# from rest_auth.registration.serializers import RegisterSerializer
# from rest_framework.authtoken.models import Token

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

class WishListItemSerializer(serializers.ModelSerializer):
    class Meta:
        model  = WishListItem 
        fields = ('game', 'user', 'target_price', 'id')


class WishListSerializer(serializers.ModelSerializer):
    game = ShortenedGameSerializer()

    class Meta:
        model  = WishListItem 
        fields = ('game', 'target_price', 'id')

        def get_game(self, obj):
            serializer_data = GameSerializer(obj.game.filter(users__id__contains=id))
            game = serializer_data.get('steam_id')
            return {'game': game}