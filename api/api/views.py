from django.core.cache import cache
from django.shortcuts import render  # remove if unused
import requests
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer

TVMAZE_SEARCH_URL = "https://api.tvmaze.com/search/shows"
SEARCH_TIMEOUT = 5
SEARCH_CACHE_SECONDS = 60 * 10

session = requests.Session()


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

def serialize_show(show: dict) -> dict:
    premiered = show.get("premiered")
    return {
        "tvmaze_id": show.get("id"),
        "name": show.get("name"),
        "year": premiered[:4] if premiered else None,
        "language": show.get("language"),
        "genres": show.get("genres", []),
        "status": show.get("status"),
        "runtime": show.get("runtime"),
        "summary": show.get("summary"),
        "image": (show.get("image") or {}).get("medium"),
    }


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

        cache_key = f"tvmaze:search:{query.lower()}"
        results = cache.get(cache_key)

        if results is None:
            try:
                resp = session.get(
                    TVMAZE_SEARCH_URL, params={"q": query}, timeout=SEARCH_TIMEOUT
                )
                resp.raise_for_status()
                raw = resp.json()
            except (requests.RequestException, ValueError):
                return Response(
                    {"detail": "Failed to fetch TV data."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

            results = [
                serialize_show(item["show"])
                for item in raw
                if item.get("show", {}).get("id") is not None
                and query.lower() in item["show"].get("name", "").lower()
            ]
            cache.set(cache_key, results, SEARCH_CACHE_SECONDS)

        return Response(results)

TVMAZE_SHOW_URL = "https://api.tvmaze.com/shows/{show_id}"
SHOW_CACHE_SECONDS = 60 * 60
NOT_FOUND_CACHE_SECONDS = 60 * 5
NOT_FOUND = "not_found"

class ShowDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request, show_id: int):
        cache_key = f"tvmaze:show:{show_id}"
        result = cache.get(cache_key)

        if result is None:
            try:
                resp = session.get(
                    TVMAZE_SHOW_URL.format(show_id=show_id),
                    timeout=SEARCH_TIMEOUT,
                )
                if resp.status_code == 404:
                    result = NOT_FOUND
                    cache.set(cache_key, result, NOT_FOUND_CACHE_SECONDS)
                else:
                    resp.raise_for_status()
                    result = serialize_show(resp.json())
                    cache.set(cache_key, result, SHOW_CACHE_SECONDS)
            except (requests.RequestException, ValueError):
                return Response(
                    {"detail": "Failed to fetch TV data."},
                    status=status.HTTP_502_BAD_GATEWAY,
                )

        if result == NOT_FOUND:
            return Response(
                {"detail": "Show not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        return Response(result)