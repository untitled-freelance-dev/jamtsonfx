from django.contrib.auth.models import User


User._meta.get_field('email')._unique = True
User.USERNAME_FIELD = 'email'
User.REQUIRED_FIELDS = ['username']
User._meta.get_field('username')._unique = False
