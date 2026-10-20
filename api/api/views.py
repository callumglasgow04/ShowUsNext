from django.core.cache import cache
from rest_framework import generics, permissions, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import RegisterSerializer, ShowListSerializer, ShowListItemSerializer
from .services import TMDBError, TMDBNotFound, get_show, search_shows
from .models import ShowList, ShowListItem
from django.shortcuts import get_object_or_404

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

class ShowListView(generics.ListCreateAPIView):
    serializer_class = ShowListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShowList.objects.filter(user=self.request.user).prefetch_related("items")

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class ShowListDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = ShowListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ShowList.objects.filter(user=self.request.user).prefetch_related("items")


class ShowListItemCreateView(generics.CreateAPIView):
    serializer_class = ShowListItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, pk):
        show_list = get_object_or_404(ShowList, pk=pk, user=request.user)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        item, created = ShowListItem.objects.get_or_create(
            show_list=show_list, tmdb_id=serializer.validated_data["tmdb_id"]
        )
        return Response(
            self.get_serializer(item).data,
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )


class ShowListItemDeleteView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk, tmdb_id):
        deleted, _ = ShowListItem.objects.filter(
            show_list__pk=pk, show_list__user=request.user, tmdb_id=tmdb_id
        ).delete()
        if not deleted:
            return Response(
                {"detail": "Show not found in this list."},
                status=status.HTTP_404_NOT_FOUND,
            )
        return Response(status=status.HTTP_204_NO_CONTENT)