from django.shortcuts import render
from rest_framework import generics, permissions
from .serializers import RegisterSerializer

from rest_framework.decorators import api_view
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
def health(request):
    return Response({'status': 'ok'})

@api_view(['GET'])
def me(request):
    return Response({
        "id": request.user.id,
        "username": request.user.username,
        "email": request.user.email,
        "firstName": request.user.first_name,
        "lastName": request.user.last_name
    })

class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]