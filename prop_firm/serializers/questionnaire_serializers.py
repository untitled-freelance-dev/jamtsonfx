import uuid
import itertools
from rest_framework import serializers

# Custom Import
from .category_serializers import CategorySerializer
from prop_firm.models import Questions, Answers


class QuestionSerializers(serializers.ModelSerializer):
    class Meta:
        model = Questions
        fields = ['id', 'category', 'question']

    def to_internal_value(self, request_data: dict) -> dict:
        question_id = request_data.get('id')
        category = request_data.get('category')
        question = request_data.get('question')
        if not category:
            raise serializers.ValidationError({'category': 'This field is required.'})
        if not question:
            raise serializers.ValidationError({'question': 'This field is required.'})
        validated_data = {
            'id': uuid.UUID(question_id) if question_id else None,
            'category': uuid.UUID(category),
            'question': question
        }
        return dict(filter(lambda item: item[1], validated_data.items()))

    def to_representation(self, instance) -> dict:
        return {
            'id': str(instance.id),
            'category': str(instance.category.id),
            'question': instance.question
        }

    @classmethod
    def retrieve(cls, primary_key: str = '', foreign_key=None):
        if primary_key:
            return Questions.objects.filter(id=primary_key)
        elif foreign_key:
            return Questions.objects.filter(category=foreign_key)
        else:
            return Questions.objects.all()


class AnswerSerializers(serializers.ModelSerializer):
    class Meta:
        model = Answers
        fields = ['id', 'answer', 'question']

    def to_internal_value(self, request_data: dict) -> dict:
        answer_id = request_data.get('id')
        answer = request_data.get('answer')
        validated_data = {
            'id': uuid.UUID(answer_id) if answer_id else None,
            'answer': answer
        }
        return dict(filter(lambda item: item[1], validated_data.items()))

    def to_representation(self, instance) -> dict:
        return {
            'id': str(instance.id),
            'question': str(instance.question.id),
            'answer': instance.answer
        }

    @classmethod
    def retrieve(cls, primary_key: str = '', foreign_key=None):
        if primary_key:
            return Answers.objects.filter(id=primary_key)
        elif foreign_key:
            return Answers.objects.filter(question=foreign_key)
        else:
            return Answers.objects.all()


class QuestionnaireSerializers(serializers.Serializer):

    def to_internal_value(self, request_data: dict) -> dict:
        question_info = QuestionSerializers(data=request_data.get('questionInfo'), required=True)
        answer_info = AnswerSerializers(data=request_data.get('answerInfo'), required=True, many=True)
        if not question_info.is_valid():
            raise serializers.ValidationError({'questionInfo': 'This field has problem.'})
        if not answer_info.is_valid():
            raise serializers.ValidationError({'answerInfo': 'This field has problem.'})
        return {
            'questionInfo': question_info.validated_data,
            'answerInfo': answer_info.validated_data
        }

    def to_representation(self, instance) -> dict:
        return {
            'questionInfo': instance[0],
            'answerInfo': instance[1]
        }

    def create(self, validated_data: dict):
        question_data = validated_data.get('questionInfo')
        answer_data = validated_data.get('answerInfo')
        category = self.retrieve('Category', question_data.pop('category')) if question_data.get('category') else []
        if len(category) > 0:
            question = Questions.objects.create(category=category[0], **question_data)
            for answer in answer_data:
                Answers.objects.create(question=question, **answer)
            return question, Answers.objects.filter(question=question), True
        else:
            return None, None, False

    def update(self, instance, validated_data: dict):
        question_data = validated_data.get('questionInfo')
        answer_data = validated_data.pop('answerInfo')
        category = self.retrieve('Category', question_data.pop('category')) if question_data.get('category') else []
        if len(category) > 0:
            instance.update(**question_data)
            previous_answers = self.retrieve('Answers', foreign_key=instance[0])
            if len(previous_answers) <= len(answer_data):
                for answer_info in answer_data:
                    answer_info['question'] = instance[0]
                    Answers.objects.update_or_create(id=answer_info.get('id'), defaults=answer_info)
            else:
                answer_data_ids = list(map(lambda answer_info: answer_info.get('id'), answer_data))
                for previous_answer_data in previous_answers:
                    if previous_answer_data.id not in answer_data_ids:
                        previous_answer_data.delete()
                    else:
                        previous_answers.filter(id=previous_answer_data.id).update(
                            **answer_data[answer_data_ids.index(previous_answer_data.id)])
            return instance[0], True
        else:
            return None, False

    @classmethod
    def retrieve(cls, instance_name: str, primary_key=None, foreign_key=None, query_object=None):
        if instance_name.upper() == 'ALL' and primary_key:
            category = CategorySerializer.retrieve(primary_key)
            if len(category) > 0:
                question_instance_list = QuestionSerializers.retrieve(foreign_key=category[0])
            else:
                question_instance_list = []
            return list(map(lambda question_instance: (QuestionSerializers(instance=question_instance).data,
                                                       AnswerSerializers(instance=AnswerSerializers.retrieve(
                                                           foreign_key=question_instance), many=True).data),
                            question_instance_list))

            # else:
            #     question_object = QuestionSerializers(instance=QuestionSerializers.retrieve(), many=True)
            #     answer_object = AnswerSerializers(instance=AnswerSerializers.retrieve(), many=True)
            # return list(map(lambda question_info: (question_info, list(
            #     filter(lambda answer_info: question_info.get('id') == answer_info.get('question'),
            #            answer_object.data))),
            #                 question_object.data))
        elif instance_name.upper() == 'ALL' and not primary_key:
            question_instance_list = list(itertools.chain.from_iterable(
                list(map(lambda category: QuestionSerializers.retrieve(foreign_key=category),
                         CategorySerializer.retrieve()))))
            return list(map(lambda question_instance: (QuestionSerializers(instance=question_instance).data,
                                                       AnswerSerializers(instance=AnswerSerializers.retrieve(
                                                           foreign_key=question_instance), many=True).data),
                            question_instance_list))
        elif instance_name.upper() == 'CATEGORY':
            if primary_key:
                return CategorySerializer.retrieve(primary_key)
            else:
                CategorySerializer.retrieve()
        elif instance_name.upper() == 'QUESTIONS':
            return QuestionSerializers.retrieve(primary_key)
        elif instance_name.upper() == 'ANSWERS':
            return AnswerSerializers.retrieve(primary_key, foreign_key)
        else:
            if primary_key:
                question_object = QuestionSerializers(instance=QuestionSerializers.retrieve(primary_key)[0])
            else:
                question_object = QuestionSerializers(instance=query_object)
            if primary_key:
                answer_object = AnswerSerializers(instance=query_object, many=True)
            else:
                answer_object = AnswerSerializers(instance=AnswerSerializers.retrieve(foreign_key=query_object),
                                                  many=True)
            return question_object.data, answer_object.data

    def destroy(self):
        try:
            self.instance.delete(),
            return True, ''
        except Exception as errorMessage:
            return False, errorMessage
