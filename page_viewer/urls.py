from django.urls import path
from django.shortcuts import redirect

# Custom Import
from page_viewer import views

urlpatterns = [
    path('', lambda req: redirect('/welcome')),
    path('welcome', views.home_page),
    path('login', views.login_page),
    path('best-match', views.find_page),
    path('discount', views.discount_page),
    path('news-letter', views.newsletter_view),
    path('prop-firms', views.prop_firm_page),
    path('prop-firms/<str:prop_firm_name>/', views.prop_firm_blog_page)
]
