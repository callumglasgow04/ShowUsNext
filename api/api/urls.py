from django.urls import path
from .views import health, me, RegisterView

urlpatterns = [
    path("health/", health),
    path("me/", me),

    path("auth/register/", RegisterView.as_view(), name="register"),
]