from django.urls import path

# Custom Import
from prop_firm.views import PropFirmCombination

urlpatterns = [
    path('create', PropFirmCombination.as_view()),
    path('update', PropFirmCombination.as_view()),
    path('retrieve', PropFirmCombination.as_view()),
    path('destroy', PropFirmCombination.as_view())
]