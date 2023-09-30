from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin', admin.site.urls),
    path('', include('page_viewer.urls')),
    path('api/authentication/', include('authentication.urls')),
    path('api/prop-firm/', include('prop_firm.urls')),
    path('api/news-letter/', include('news_letter.urls'))
]
