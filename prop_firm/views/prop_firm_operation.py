from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# Custom Import
from prop_firm.serializers import PropFirmSerializer


class PropFirm(APIView):

    def get(self, request):
        prop_firm_id = request.GET.get('id', '')
        prop_firm_name = request.GET.get('name', '')
        if prop_firm_id:
            prop_firm = PropFirmSerializer.retrieve(primary_key=prop_firm_id)
        elif prop_firm_name:
            prop_firm = PropFirmSerializer.retrieve(name=prop_firm_name)
        else:
            prop_firm = PropFirmSerializer.retrieve()
        serializer = PropFirmSerializer(instance=prop_firm, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PropFirmSerializer(data=request.data)
        if serializer.is_valid():
            prop_firm = serializer.save()
            response_data = {
                'propFirmID': str(prop_firm.pk),
                'status': True,
                'message': 'PropFirm created successfully'
            }
            status_code = status.HTTP_201_CREATED
        else:
            print(f'PropFirm creation failed as - {str(serializer.errors)}', flush=True)
            response_data = {
                'propFirmID': '',
                'status': False,
                'message': f'PropFirm creation failed as - {str(serializer.errors)}'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code)

    def put(self, request):
        prop_firm_name = request.data.get('name', '')
        prop_firm = PropFirmSerializer.retrieve(name=prop_firm_name) if prop_firm_name else []
        if len(prop_firm) > 0:
            serializer = PropFirmSerializer(instance=prop_firm[0], data=request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = None
                status_code = status.HTTP_204_NO_CONTENT
            else:
                print(f'PropFirm modification failed as - {str(serializer.errors)}', flush=True)
                response_data = {
                    'status': False,
                    'message': f'PropFirm modification failed as - {str(serializer.errors)}'
                }
                status_code = status.HTTP_400_BAD_REQUEST
        else:
            print(f'PropFirm modification failed as - PropFirm ID ({prop_firm_name}) not found', flush=True)
            response_data = {
                'status': False,
                'message': f'PropFirm modification failed as - PropFirm ID ({prop_firm_name}) not found'
            }
            status_code = status.HTTP_404_NOT_FOUND
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)

    def delete(self, request):
        prop_firm_name = request.GET.get('name')
        if prop_firm_name:
            prop_firm = PropFirmSerializer.retrieve(name=prop_firm_name) if prop_firm_name else []
            if len(prop_firm) > 0:
                serializer = PropFirmSerializer(instance=prop_firm)
                is_deleted, message = serializer.destroy()
                if is_deleted:
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'PropFirm deletion failed as - {message}', flush=True)
                    response_data = {
                        'status': False,
                        'message': f'PropFirm deletion failed as - {message}'
                    }
                    status_code = status.HTTP_400_BAD_REQUEST
            else:
                print(f'PropFirm deletion failed as - PropFirm ID ({prop_firm_name}) not found', flush=True)
                response_data = {
                    'status': False,
                    'message': f'PropFirm deletion failed as - PropFirm ID ({prop_firm_name}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print('PropFirm deletion failed as - PropFirm ID not provided', flush=True)
            response_data = {
                'status': False,
                'message': 'PropFirm deletion failed as - PropFirm ID not provided'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)
