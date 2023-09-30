from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

# Custom Import
from prop_firm.serializers import QuestionnaireSerializers


class Questionnaire(APIView):

    def get(self, request):
        questionnaire = QuestionnaireSerializers.retrieve('all', primary_key=request.GET.get('category'))
        if len(questionnaire) > 0:
            serializer = QuestionnaireSerializers(instance=questionnaire, many=True)
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        else:
            return Response([], status=status.HTTP_200_OK)

    def post(self, request):
        serializer = QuestionnaireSerializers(data=request.data)
        if serializer.is_valid():
            question_object, answer_object, questionnaire_creation_flag = serializer.save()
            if questionnaire_creation_flag:
                questionnaire = serializer.retrieve('Questionnaire', question_object.pk, query_object=answer_object)
                response_data = {
                    'data': QuestionnaireSerializers(instance=questionnaire).data,
                    'status': True,
                    'message': 'Questionnaire created successfully'
                }
                status_code = status.HTTP_201_CREATED
            else:
                print(f'Questionnaire creation failed as category not found', flush=True)
                response_data = {
                    'data': {},
                    'status': False,
                    'message': 'Questionnaire creation failed as - category not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print(f'Questionnaire creation failed as - {str(serializer.errors)}', flush=True)
            response_data = {
                'data': {},
                'status': False,
                'message': f'Questionnaire creation failed as - {str(serializer.errors)}'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code)

    def put(self, request):
        if request.data.get('questionInfo') and request.data.get('questionInfo').get('id'):
            question_id = request.data.get('questionInfo').get('id')
        else:
            question_id = ''
        question_object = QuestionnaireSerializers.retrieve('Questions', question_id) if question_id else []
        if len(question_object) > 0:
            serializer = QuestionnaireSerializers(instance=question_object, data=request.data)
            if serializer.is_valid():
                question_object, questionnaire_modification_flag = serializer.save()
                if questionnaire_modification_flag:
                    serializer.retrieve('Questionnaire', query_object=question_object)
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'Questionnaire modification failed as category not found', flush=True)
                    response_data = {
                        'data': {},
                        'status': False,
                        'message': 'Questionnaire modification failed as - category not found'
                    }
                    status_code = status.HTTP_404_NOT_FOUND
            else:
                print(f'Questionnaire modification failed as - {str(serializer.errors)}', flush=True)
                response_data = {
                    'data': {},
                    'status': False,
                    'message': f'Questionnaire modification failed as - {str(serializer.errors)}'
                }
                status_code = status.HTTP_400_BAD_REQUEST
        else:
            print(f'Questionnaire modification failed as - Question ID ({question_id}) not found', flush=True)
            response_data = {
                'data': {},
                'status': False,
                'message': f'Questionnaire modification failed as - Question ID ({question_id}) not found'
            }
            status_code = status.HTTP_404_NOT_FOUND

        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)

    def delete(self, request):
        questionnaire_id = request.GET.get('id')
        if questionnaire_id:
            questionnaire = QuestionnaireSerializers.retrieve('Questions', questionnaire_id)
            if len(questionnaire) > 0:
                category_serializer = QuestionnaireSerializers(instance=questionnaire)
                is_deleted, message = category_serializer.destroy()
                if is_deleted:
                    response_data = None
                    status_code = status.HTTP_204_NO_CONTENT
                else:
                    print(f'Questionnaire modification failed as - {message}', flush=True)
                    response_data = {
                        'status': False,
                        'message': f'Questionnaire deletion failed as - {message}'
                    }
                    status_code = status.HTTP_400_BAD_REQUEST
            else:
                print(f'Questionnaire deletion failed as - Questionnaire ID ({questionnaire_id}) not found', flush=True)
                response_data = {
                    'status': False,
                    'message': f'Questionnaire deletion failed as - Questionnaire ID ({questionnaire_id}) not found'
                }
                status_code = status.HTTP_404_NOT_FOUND
        else:
            print('Questionnaire deletion failed as - Questionnaire ID not provided', flush=True)
            response_data = {
                'status': False,
                'message': 'Questionnaire deletion failed as - Questionnaire ID not provided'
            }
            status_code = status.HTTP_400_BAD_REQUEST
        return Response(data=response_data, status=status_code) if response_data else Response(status=status_code)
