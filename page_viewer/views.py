from django.shortcuts import render


def home_page(request):
    return render(request, 'home.html')


def login_page(request):
    return render(request, 'login.html')


def find_page(request):
    return render(request, 'bestMatch.html')


def prop_firm_page(request):
    search_query = request.GET.get('search', '')
    return render(request, 'propFirms.html', {'searchQuery': search_query})


def prop_firm_blog_page(request, prop_firm_name):
    return render(request, 'propFirmBlogs.html', {'propFirm': prop_firm_name})


def discount_page(request):
    return render(request, 'discount.html')


def newsletter_view(request):
    return render(request, 'newsletterEntries.html')