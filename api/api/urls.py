from django.urls import path
from .views import health, me, RegisterView, ShowSearchView, ShowDetailView

urlpatterns = [
    path("health/", health),
    path("me/", me),

    path("auth/register/", RegisterView.as_view(), name="register"),
    path("shows/search/", ShowSearchView.as_view(), name="show-search"),
    path("shows/<int:show_id>/", ShowDetailView.as_view()),
]