from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# Custom Import
from news_letter.serializers import NewsLetterSerializers


class NewsLetter(APIView):

    def get(self, request):
        serializer = NewsLetterSerializers(instance=NewsLetterSerializers.retrieve(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = NewsLetterSerializers(data=request.data)
        if serializer.is_valid():
            news_letter = serializer.save()
            response_data = {
                'newsLetterID': str(news_letter.pk),
                'status': True,
                'message': 'News Letter created successfully'
            }
            status_code = status.HTTP_201_CREATED
        else:
            print(f'News Letter creation failed as - {str(serializer.errors)}', flush=True)
            response_data = {
                'categoryID': '',
                'status': False,
                'message': f'News Letter creation failed as - {str(serializer.errors)}'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code)

    def put(self, request):
        news_letter_id = request.data.get('id', '')
        news_letter = NewsLetterSerializers.retrieve(news_letter_id) if news_letter_id else []
        if len(news_letter) > 0:
            serializer = NewsLetterSerializers(instance=news_letter, data=request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = None
                status_code = status.HTTP_204_NO_CONTENT
            else:
                print(f'News Letter modification failed as - {str(serializer.errors)}', flush=True)
                response_data = {
                    'status': False,
                    'message': f'News Letter modification failed as - {str(serializer.errors)}'
                }
                status_code = status.HTTP_400_BAD_REQUEST
        else:
            print(f'News Letter modification failed as - Category ID ({news_letter_id}) not found', flush=True)
            response_data = {
                'status': False,
                'message': f'News Letter modification failed as - Category ID ({news_letter_id}) not found'
            }
            status_code = status.HTTP_404_NOT_FOUND
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)

    def delete(self, request):
        newsletter_id = request.GET.get('id')
        if newsletter_id:
            newsletter = NewsLetterSerializers.retrieve(newsletter_id) if newsletter_id else []
            if len(newsletter) > 0:
                serializer = NewsLetterSerializers(instance=newsletter)
                is_deleted, message = serializer.destroy()
                if is_deleted:
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'Newsletter deletion failed as - {message}', flush=True)
                    response_data = {
                        'status': False,
                        'message': f'Newsletter deletion failed as - {message}'
                    }
                    status_code = status.HTTP_400_BAD_REQUEST
            else:
                print(f'Newsletter deletion failed as - Newsletter ID ({newsletter_id}) not found', flush=True)
                response_data = {
                    'status': False,
                    'message': f'Newsletter deletion failed as - Newsletter ID ({newsletter_id}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print('Newsletter deletion failed as - Newsletter ID not provided', flush=True)
            response_data = {
                'status': False,
                'message': 'Newsletter deletion failed as - Newsletter ID not provided'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)