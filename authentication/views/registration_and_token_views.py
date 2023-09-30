from django.contrib import auth
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

# Custom Import
from authentication.serializers import UserSerializer, JWTTokenObtainPairSerializer


class Register(APIView):

    def post(self, *args, **kwargs):
        user_serializer = UserSerializer(data=self.request.data)
        if user_serializer.is_valid():
            auth.get_user_model().objects.create_user(**user_serializer.validated_data)
            return Response(status=status.HTTP_201_CREATED, data={'message': 'User Created Successfully'})
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST, data={'error': user_serializer.errors})


class JWTTokenObtainPair(TokenObtainPairView):
    serializer_class = JWTTokenObtainPairSerializer
