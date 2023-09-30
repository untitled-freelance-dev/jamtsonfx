import uuid
from typing import Union
from rest_framework import serializers

# Custom Import
from prop_firm.models import PropFirm, Questionnaire


class PropFirmCombinationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Questionnaire
        fields = ['id', 'question_ids', 'answer_ids', 'prop_firm']

    def to_internal_value(self, request_data: dict) -> dict:
        questionnaire_mappings_id = request_data.get('id')
        question_ids = request_data.get('questionIDs')
        answer_ids = request_data.get('answerIDs')
        prop_firm = request_data.get('propFirmID')
        if not question_ids:
            raise serializers.ValidationError({'questionIDs': 'This field is required.'})
        if not answer_ids:
            raise serializers.ValidationError({'answerIDs': 'This field is required.'})
        if not prop_firm:
            raise serializers.ValidationError({'propFirmID': 'This field is required.'})
        prop_firm_object = self.retrieve('Prop_firm', primary_key=uuid.UUID(prop_firm))
        validated_data = {
            'id': uuid.UUID(questionnaire_mappings_id) if questionnaire_mappings_id else None,
            'question_ids': question_ids,
            'answer_ids': answer_ids,
            'prop_firm': prop_firm_object[0] if len(prop_firm_object) > 0 else None
        }
        return dict(filter(lambda item: item[1], validated_data.items()))

    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'questionIDs': instance.question_ids,
            'answerIDs': instance.answer_ids,
            'propFirm': str(instance.prop_firm_id)
        }

    def update(self, instance, validated_data):
        validated_data.pop('id')
        return instance.update(**validated_data)

    @classmethod
    def retrieve(cls, model_name: str, primary_key: Union[uuid.UUID, str] = '', question_ids: str = '',
                 answer_ids: str = '') -> list:
        if model_name.upper() == 'PROP_FIRM' and primary_key:
            return PropFirm.objects.filter(id=primary_key)
        if model_name.upper() == 'QUESTIONNAIRE_MAPPINGS':
            if primary_key:
                return Questionnaire.objects.filter(id=primary_key)
            elif question_ids and answer_ids:
                return Questionnaire.objects.filter(question_ids=question_ids, answer_ids=answer_ids)
            else:
                return Questionnaire.objects.all()

    def destroy(self):
        try:
            self.instance.delete()
            return True, ''
        except Exception as errorMessage:
            return False, errorMessage
