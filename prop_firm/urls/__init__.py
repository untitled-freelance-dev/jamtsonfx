from django.urls import path, include

urlpatterns = [
    path('', include('prop_firm.urls.prop_firm_urls')),
    path('questionnaire/', include('prop_firm.urls.questionnaire_urls')),
    path('category/', include('prop_firm.urls.category_urls')),
    path('combination/', include('prop_firm.urls.prop_firm_combination_urls')),
    path('discount/', include('prop_firm.urls.discount_urls'))
]
