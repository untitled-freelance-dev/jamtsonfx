from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# Custom Import
from prop_firm.serializers import CategorySerializer


class Category(APIView):

    def get(self, request):
        serializer = CategorySerializer(instance=CategorySerializer.retrieve(), many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = CategorySerializer(data=request.data)
        if serializer.is_valid():
            category = serializer.save()
            response_data = {
                'categoryID': str(category.pk),
                'status': True,
                'message': 'Category created successfully'
            }
            status_code = status.HTTP_201_CREATED
        else:
            print(f'Category creation failed as - {str(serializer.errors)}', flush=True)
            response_data = {
                'categoryID': '',
                'status': False,
                'message': f'Category creation failed as - {str(serializer.errors)}'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code)

    def put(self, request):
        category_id = request.data.get('id', '')
        category = CategorySerializer.retrieve(category_id) if category_id else []
        if len(category) > 0:
            serializer = CategorySerializer(instance=category[0], data=request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = None
                status_code = status.HTTP_204_NO_CONTENT
            else:
                print(f'Category modification failed as - {str(serializer.errors)}', flush=True)
                response_data = {
                    'status': False,
                    'message': f'Category modification failed as - {str(serializer.errors)}'
                }
                status_code = status.HTTP_400_BAD_REQUEST
        else:
            print(f'Category modification failed as - Category ID ({category_id}) not found', flush=True)
            response_data = {
                'status': False,
                'message': f'Category modification failed as - Category ID ({category_id}) not found'
            }
            status_code = status.HTTP_404_NOT_FOUND
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)

    def delete(self, request):
        category_id = request.GET.get('id')
        if category_id:
            category = CategorySerializer.retrieve(category_id) if category_id else []
            if len(category) > 0:
                serializer = CategorySerializer(instance=category)
                is_deleted, message = serializer.destroy()
                if is_deleted:
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'Category deletion failed as - {message}', flush=True)
                    response_data = {
                        'status': False,
                        'message': f'Category deletion failed as - {message}'
                    }
                    status_code = status.HTTP_400_BAD_REQUEST
            else:
                print(f'Category deletion failed as - Category ID ({category_id}) not found', flush=True)
                response_data = {
                    'status': False,
                    'message': f'Category deletion failed as - Category ID ({category_id}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print('Category deletion failed as - Category ID not provided', flush=True)
            response_data = {
                'status': False,
                'message': 'Category deletion failed as - Category ID not provided'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)
