from django.core.cache import cache
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer
from .services import TMDBError, TMDBNotFound, get_show, search_shows


@api_view(["GET"])
@permission_classes([permissions.AllowAny])
def health(request):
    return Response({"status": "ok"})


@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def me(request):
    user = request.user
    return Response({
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "firstName": user.first_name,
        "lastName": user.last_name,
    })

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

SEARCH_CACHE_SECONDS = 60 * 10
SHOW_CACHE_SECONDS = 60 * 60


class ShowSearchView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        params = request.query_params
        query = (params.get("query") or params.get("q") or "").strip()
        if not query:
            return Response(
                {"detail": "Query param 'query' is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        cache_key = f"tmdb:search:{query.lower()}"
        results = cache.get(cache_key)
        if results is None:
            try:
                results = search_shows(query)
            except TMDBError:
                return Response(
                    {"detail": "Failed to fetch TV data."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            cache.set(cache_key, results, SEARCH_CACHE_SECONDS)

        return Response(results)


class ShowDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, show_id: int):
        cache_key = f"tmdb:show:{show_id}"
        result = cache.get(cache_key)
        if result is None:
            try:
                result = get_show(show_id)
            except TMDBNotFound:
                return Response(
                    {"detail": "Show not found."}, status=status.HTTP_404_NOT_FOUND
                )
            except TMDBError:
                return Response(
                    {"detail": "Failed to fetch TV data."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )
            cache.set(cache_key, result, SHOW_CACHE_SECONDS)

        return Response(result)