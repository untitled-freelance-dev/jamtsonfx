from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

class UpdatePassword(APIView):

    def post(self):
        print()