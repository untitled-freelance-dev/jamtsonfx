from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

# Custom Import
from authentication.views.registration_and_token_views import Register, JWTTokenObtainPair

urlpatterns = [
    path('register', Register.as_view(), name='Register'),
    path('login', JWTTokenObtainPair.as_view(), name='TokenObtainPair'),
    path('refreshToken', TokenRefreshView.as_view(), name='TokenRefresh')
]
