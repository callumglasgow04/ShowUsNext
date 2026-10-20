from django.urls import path
from .views import health, me, RegisterView, ShowSearchView, ShowDetailView, ShowListView, ShowListDetailView, ShowListItemCreateView, ShowListItemDeleteView

urlpatterns = [
    path("health/", health),
    path("me/", me),

    path("auth/register/", RegisterView.as_view(), name="register"),
    path("shows/search/", ShowSearchView.as_view(), name="show-search"),
    path("shows/<int:show_id>/", ShowDetailView.as_view()),
    path("lists/", ShowListView.as_view()),
    path("lists/<int:pk>/", ShowListDetailView.as_view()),
    path("lists/<int:pk>/items/", ShowListItemCreateView.as_view()),
    path("lists/<int:pk>/items/<int:tmdb_id>/", ShowListItemDeleteView.as_view()),
]