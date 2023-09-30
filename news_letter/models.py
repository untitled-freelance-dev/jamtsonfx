import uuid
from django.db import models


class NewsLetter(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.TextField(null=False, blank=False)
    email = models.EmailField(max_length=500, null=False, blank=False)
    status = models.TextField(null=True, blank=True)

    objects = models.Manager()

    class Meta:
        db_table = 'news_letter'
