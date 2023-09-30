import uuid
from rest_framework import serializers

# Custom Import
from news_letter.models import NewsLetter


class NewsLetterSerializers(serializers.ModelSerializer):
    class Meta:
        model = NewsLetter
        fields = ['id', 'name', 'email', 'status']

    def to_internal_value(self, request_data: dict) -> dict:
        news_letter_id = request_data.get('id')
        name = request_data.get('name')
        email = request_data.get('email')
        status = request_data.get('status', '')
        if not name:
            raise serializers.ValidationError({'name': 'This field is required.'})
        if not email:
            raise serializers.ValidationError({'email': 'This field is required.'})
        validated_data = {
            'id': uuid.UUID(news_letter_id) if news_letter_id else None,
            'name': name,
            'email': email,
            'status': status
        }
        return dict(filter(lambda item: item[1], validated_data.items()))

    def to_representation(self, instance):
        return {
            'id': str(instance.id),
            'name': instance.name,
            'email': instance.email,
            'status': instance.status if instance.status else ''
        }

    @classmethod
    def retrieve(cls, primary_key: str = '') -> list:
        if primary_key:
            return NewsLetter.objects.filter(id=primary_key)
        else:
            return NewsLetter.objects.all()

    def destroy(self):
        try:
            self.instance.delete()
            return True, ''
        except Exception as errorMessage:
            return False, errorMessage
