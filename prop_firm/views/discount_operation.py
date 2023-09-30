from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# Custom Import
from prop_firm.serializers import DiscountSerializer


class Discount(APIView):

    def get(self, request):
        discount_id = request.GET.get('id', '')
        if discount_id:
            discount = DiscountSerializer.retrieve(primary_key=discount_id)
        else:
            discount = DiscountSerializer.retrieve()
        serializer = DiscountSerializer(instance=discount, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = DiscountSerializer(data=request.data)
        if serializer.is_valid():
            discount = serializer.save()
            response_data = {
                'discountID': str(discount.pk),
                'status': True,
                'message': 'Discount created successfully'
            }
            status_code = status.HTTP_201_CREATED
        else:
            response_data = {
                'discountID': '',
                'status': False,
                'message': f'Discount creation failed as - {str(serializer.errors)}'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code)

    def put(self, request):
        discount_id = request.data.get('id', '')
        discount = DiscountSerializer.retrieve(primary_key=discount_id) if discount_id else []
        if len(discount) > 0:
            serializer = DiscountSerializer(instance=discount[0], data=request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = None
                status_code = status.HTTP_204_NO_CONTENT
            else:
                print(f'Discount modification failed as - {str(serializer.errors)}', flush=True)
                response_data = {
                    'status': False,
                    'message': f'Discount modification failed as - {str(serializer.errors)}'
                }
                status_code = status.HTTP_400_BAD_REQUEST
        else:
            print(f'PropFirm modification failed as - Discount ID ({discount_id}) not found', flush=True)
            response_data = {
                'status': False,
                'message': f'Discount modification failed as - Discount ID ({discount_id}) not found'
            }
            status_code = status.HTTP_404_NOT_FOUND
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)

    def delete(self, request):
        discount_id = request.GET.get('id')
        if discount_id:
            discount = DiscountSerializer.retrieve(primary_key=discount_id) if discount_id else []
            if len(discount) > 0:
                serializer = DiscountSerializer(instance=discount[0])
                is_deleted, message = serializer.destroy()
                if is_deleted:
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'Discount deletion failed as - {message}', flush=True)
                    response_data = {
                        'status': False,
                        'message': f'Discount deletion failed as - {message}'
                    }
                    status_code = status.HTTP_400_BAD_REQUEST
            else:
                print(f'Discount deletion failed as - Discount ID ({discount_id}) not found', flush=True)
                response_data = {
                    'status': False,
                    'message': f'Discount deletion failed as - Discount ID ({discount_id}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print('Discount deletion failed as - Discount ID not provided', flush=True)
            response_data = {
                'status': False,
                'message': 'Discount deletion failed as - Discount ID not provided'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)
