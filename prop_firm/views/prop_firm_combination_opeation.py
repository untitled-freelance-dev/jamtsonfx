from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# Custom Import
from prop_firm.serializers import PropFirmCombinationSerializer


class PropFirmCombination(APIView):

    def get(self, request):
        question_ids = request.GET.get('questionIDs')
        answer_ids = request.GET.get('answerIDs')
        combination_id = request.GET.get('id')
        prop_firm_id = request.GET.get('propFirmID')
        if question_ids and answer_ids:
            questionnaire_mappings = PropFirmCombinationSerializer.retrieve('Questionnaire_Mappings', 
                                                                            question_ids=question_ids, 
                                                                            answer_ids=answer_ids)
        elif combination_id:
            questionnaire_mappings = PropFirmCombinationSerializer.retrieve('Questionnaire_Mappings',
                                                                                   primary_key=combination_id)
        elif prop_firm_id:
            questionnaire_mappings = None
        else:
            questionnaire_mappings = PropFirmCombinationSerializer.retrieve('Questionnaire_Mappings')

        serializer = PropFirmCombinationSerializer(instance=questionnaire_mappings, many=True)
        return Response(data=serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = PropFirmCombinationSerializer(data=request.data)
        if serializer.is_valid():
            if serializer.validated_data.get('prop_firm'):
                prop_firm_object = serializer.save()
                response_data = {
                    'id': str(prop_firm_object.pk),
                    'status': True,
                    'message': 'PropFirm Questionnaire Combo created successfully'
                }
                status_code = status.HTTP_201_CREATED
            else:
                response_data = {
                    'id': '',
                    'status': False,
                    'message': f'PropFirm Questionnaire Combo created Failed as - PropFirm ID '
                               f'({request.data.get("propFirmID")}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print(
                f'PropFirm Questionnaire Combo creation failed as - {str(serializer.errors)}',
                flush=True)
            response_data = {
                'categoryID': '',
                'status': False,
                'message': f'PropFirm Questionnaire Combo creation failed as - {str(serializer.errors)} '
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code)

    def put(self, request):
        questionnaire_mappings_id = request.data.get('id', '')
        if questionnaire_mappings_id:
            questionnaire_mappings = PropFirmCombinationSerializer.retrieve(
                'Questionnaire_Mappings', primary_key=questionnaire_mappings_id)
        else:
            questionnaire_mappings = []
        if len(questionnaire_mappings) > 0:
            serializer = PropFirmCombinationSerializer(instance=questionnaire_mappings, data=request.data)
            if serializer.is_valid():
                serializer.save()
                response_data = None
                status_code = status.HTTP_204_NO_CONTENT
            else:
                print(f'PropFirm Questionnaire Combo modification failed as - {str(serializer.errors)}', flush=True)
                response_data = {
                    'status': False,
                    'message': f'PropFirm Questionnaire Combo modification failed as - {str(serializer.errors)} '
                }
                status_code = status.HTTP_400_BAD_REQUEST
        else:
            print(
                f'PropFirm Questionnaire Combo modification failed as - PropFirm ID ({questionnaire_mappings_id}) not '
                f'found', flush=True)
            response_data = {
                'status': False,
                'message': f'PropFirm Questionnaire Combo modification failed as - PropFirm ID '
                           f'({questionnaire_mappings_id}) not found '
            }
            status_code = status.HTTP_404_NOT_FOUND
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)

    def delete(self, request):
        questionnaire_mappings_id = request.GET.get('id')
        if questionnaire_mappings_id:
            questionnaire_mappings = PropFirmCombinationSerializer.retrieve(
                'QUESTIONNAIRE_MAPPINGS', questionnaire_mappings_id) if questionnaire_mappings_id else []
            if len(questionnaire_mappings) > 0:
                serializer = PropFirmCombinationSerializer(
                    instance=questionnaire_mappings)
                is_deleted, message = serializer.destroy()
                if is_deleted:
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'PropFirm Questionnaire Combo deletion failed as - {message}', flush=True)
                    response_data = {
                        'status': False,
                        'message': f'PropFirm Questionnaire Combo deletion failed as - {message}'
                    }
                    status_code = status.HTTP_400_BAD_REQUEST
            else:
                print(
                    f'PropFirm Questionnaire Combo deletion failed as - PropFirm ID '
                    f'({questionnaire_mappings_id}) not found',
                    flush=True)
                response_data = {
                    'status': False,
                    'message': f'PropFirm Questionnaire Combo deletion failed as - PropFirm ID '
                               f'({questionnaire_mappings_id}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print('PropFirm Questionnaire Combo deletion failed as - PropFirm ID not provided', flush=True)
            response_data = {
                'status': False,
                'message': 'PropFirm Questionnaire Combo deletion failed as - PropFirm ID not provided'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)
