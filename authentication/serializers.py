from django.contrib import auth
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class JWTTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = auth.get_user_model().USERNAME_FIELD


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = auth.get_user_model()
        fields = ('email', 'password', 'username')
