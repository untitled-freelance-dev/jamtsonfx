import uuid
from rest_framework import serializers

# Custom Import
from prop_firm.models import PropFirm


class PropFirmSerializer(serializers.ModelSerializer):
    class Meta:
        model = PropFirm
        fields = ['id', 'name', 'url', 'summary', 'logo', 'blog_content']

    def to_internal_value(self, requested_data: dict) -> dict:
        prop_firm_id = requested_data.get('id')
        name = requested_data.get('name')
        url = requested_data.get('url')
        summary = requested_data.get('summary', '')
        logo = requested_data.get('logo')
        blog_content = requested_data.get('blog_content', '')
        if not name:
            raise serializers.ValidationError({'name': 'This field is required.'})
        if not url:
            raise serializers.ValidationError({'url': 'This field is required.'})
        validated_data = {
            'id': uuid.UUID(prop_firm_id) if prop_firm_id else None,
            'name': name,
            'url': url,
            'summary': summary,
            'logo': logo,
            'blog_content': blog_content
        }
        validated_data = dict(filter(lambda item: item[1], validated_data.items()))
        return validated_data

    def to_representation(self, instance) -> dict:
        return {
            'id': str(instance.id),
            'name': instance.name,
            'url': instance.url,
            'summary': instance.summary,
            'logo': instance.logo.url,
            'blog_content': instance.blog_content
        }

    @classmethod
    def retrieve(cls, primary_key: str = '', name: str = '') -> list:
        if primary_key:
            return PropFirm.objects.filter(id=primary_key)
        elif name:
            return PropFirm.objects.filter(name=name)
        else:
            return PropFirm.objects.all()

    def destroy(self):
        try:
            self.instance.delete()
            return True, ''
        except Exception as error_message:
            return False, error_message
