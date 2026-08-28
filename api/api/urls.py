from django.urls import path
from .views import health, me

urlpatterns = [
    path("health/", health),
    path("me/", me),
]