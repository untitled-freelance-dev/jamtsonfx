import uuid
from rest_framework import serializers

# Custom Import
from prop_firm.models import Category


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'category']

    def to_internal_value(self, request_data: dict) -> dict:
        category_id = request_data.get('id')
        category = request_data.get('category')
        if not category:
            raise serializers.ValidationError({'category': 'This field is required.'})
        validated_data = {
            'id': uuid.UUID(category_id) if category_id else None,
            'category': category
        }
        return dict(filter(lambda item: item[1], validated_data.items()))

    def to_representation(self, instance) -> dict:
        return {
            'id': str(instance.id),
            'category': instance.category
        }

    @classmethod
    def retrieve(cls, primary_key: str = '') -> list:
        if primary_key:
            return Category.objects.filter(id=primary_key)
        else:
            return Category.objects.all()

    def destroy(self):
        try:
            self.instance.delete()
            return True, ''
        except Exception as errorMessage:
            return False, errorMessage
