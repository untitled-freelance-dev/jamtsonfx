from django.urls import path

# Custom Import
from prop_firm.views import PropFirm

urlpatterns = [
    path('create', PropFirm.as_view()),
    path('update', PropFirm.as_view()),
    path('retrieve', PropFirm.as_view()),
    path('destroy', PropFirm.as_view())
]
