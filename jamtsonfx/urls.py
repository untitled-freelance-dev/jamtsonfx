from django.conf import settings
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static

urlpatterns = [
    path('admin', admin.site.urls),
    path('', include('page_viewer.urls')),
    path('api/authentication/', include('authentication.urls')),
    path('api/prop-firm/', include('prop_firm.urls')),
    path('api/news-letter/', include('news_letter.urls'))
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
