import uuid
from rest_framework import serializers

# Custom Import
from prop_firm.models import Discount
from .prop_firm_serializers import PropFirmSerializer


class DiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['id', 'prop_firm', 'percentage', 'code']

    def to_internal_value(self, requested_data: dict) -> dict:
        discount_id = requested_data.get('id')
        prop_firm = requested_data.get('prop_firm')
        percentage = requested_data.get('percentage')
        code = requested_data.get('code')
        if not prop_firm:
            raise serializers.ValidationError({'prop_firm': 'This field is required.'})
        if not percentage:
            raise serializers.ValidationError({'percentage': 'This field is required.'})
        if not code:
            raise serializers.ValidationError({'code': 'This field is required.'})
        instance = PropFirmSerializer.retrieve(name=prop_firm)
        validated_data = {
            'id': uuid.UUID(discount_id) if discount_id else None,
            'prop_firm': instance[0] if len(instance) > 0 else None,
            'percentage': percentage,
            'code': code
        }
        return dict(filter(lambda item: item[1], validated_data.items()))

    def to_representation(self, instance) -> dict:
        return {
            'id': str(instance.id),
            'logo': instance.prop_firm.logo.url,
            'name': instance.prop_firm.name,
            'percentage': instance.percentage,
            'code': instance.code,
            'url': instance.prop_firm.url,
        }

    @classmethod
    def retrieve(cls, primary_key: str = '') -> list:
        if primary_key:
            return Discount.objects.filter(id=primary_key)
        else:
            return Discount.objects.all()

    def destroy(self):
        try:
            self.instance.delete()
            return True, ''
        except Exception as error_message:
            return False, error_message
