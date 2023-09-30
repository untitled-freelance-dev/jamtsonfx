from django.contrib import auth
from django.contrib.auth.backends import ModelBackend


class Verification(ModelBackend):

    def authenticate(self, request, **kwargs):
        user_model = auth.get_user_model()
        try:
            email = kwargs.get('email') if kwargs.get('email') else kwargs.get('username')
            user_object = user_model.objects.get(email=email)
            if user_object.check_password(kwargs.get('password')):
                return user_object
        except user_model.DoesNotExist:
            return None
        return None
