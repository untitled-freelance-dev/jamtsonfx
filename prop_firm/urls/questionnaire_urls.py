from django.urls import path

# Custom Import
from prop_firm.views import Questionnaire

urlpatterns = [
    path('create', Questionnaire.as_view()),
    path('update', Questionnaire.as_view()),
    path('retrieve', Questionnaire.as_view()),
    path('destroy', Questionnaire.as_view())
]