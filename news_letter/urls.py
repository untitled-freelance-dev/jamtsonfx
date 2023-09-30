from django.urls import path

# Custom Import
from news_letter.views import NewsLetter

urlpatterns = [
    path('create', NewsLetter.as_view()),
    path('update', NewsLetter.as_view()),
    path('retrieve', NewsLetter.as_view()),
    path('destroy', NewsLetter.as_view())
]
