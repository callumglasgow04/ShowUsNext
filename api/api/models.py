from django.db import models
from django.conf import settings
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    email = models.EmailField(unique=True)

    def __str__(self):
        return self.username

class ShowList(models.Model):
    class ListType(models.TextChoices):
        WATCH_NEXT = "watch_next", "Watch Next"
        FAVORITES = "favorites", "All-Time Favourites"
        WATCHING = "watching", "Currently Watching"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="show_lists",
    )
    name = models.CharField(max_length=100)
    list_type = models.CharField(
        max_length=30,
        choices=ListType.choices,
        null=True,
        blank=True,
    )
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["user", "list_type"],
                name="unique_user_default_list_type",
            ),
        ]

    def __str__(self):
        return f"{self.user} - {self.name}"

class ShowListItem(models.Model):
    show_list = models.ForeignKey(
        ShowList,
        on_delete=models.CASCADE,
        related_name="items",
    )
    tmdb_id = models.PositiveIntegerField()
    added_at = models.DateTimeField(auto_now_add=True)
    position = models.PositiveIntegerField(default=0)

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=["show_list", "tmdb_id"],
                name="unique_show_per_list",
            ),
        ]
        ordering = ["position", "-added_at"]

    def __str__(self):
        return f"{self.show_list.name} - {self.tmdb_id}"