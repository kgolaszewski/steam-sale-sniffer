from django.db import models
from django.contrib.auth.models import AbstractUser 

# Create your models here.
class User(AbstractUser):
    class Meta:
        pass
        # permissions = (
        #     ('add_wishlistitems', 'Add WishListItems'),
        # )
    def __str__(self):
        return self.username 


class Game(models.Model):
    title = models.CharField(max_length=128)
    steam_id = models.IntegerField()
    base_price = models.DecimalField(max_digits=5, decimal_places=2)
    curr_price = models.DecimalField(max_digits=5, decimal_places=2)
    users = models.ManyToManyField(User, through='WishListItem', related_name='games', blank=True)

    def __str__(self):
        return self.title

class WishListItem(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    target_price = models.DecimalField(max_digits=5, decimal_places=2)
    purchased = models.BooleanField(default=False, blank=True)

    def __str__(self):
        return f"{self.user}: {self.game} (${self.target_price if not self.purchased else 'OWNED'})"
    
    # class Meta:
    #     app_label = 'wishlists'