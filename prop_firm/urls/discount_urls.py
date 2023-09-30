from django.urls import path

# Custom Import
from prop_firm.views import Discount

urlpatterns = [
    path('create', Discount.as_view()),
    path('update', Discount.as_view()),
    path('retrieve', Discount.as_view()),
    path('destroy', Discount.as_view())
]
