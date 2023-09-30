from django.urls import path

# Custom Import
from prop_firm.views import Category

urlpatterns = [
    path('create', Category.as_view()),
    path('update', Category.as_view()),
    path('retrieve', Category.as_view()),
    path('destroy', Category.as_view())
]