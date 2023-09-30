import uuid
from django.db import models


class PropFirm(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=300, null=False, blank=False)
    url = models.TextField(null=False, blank=False)
    summary = models.TextField(null=True, blank=True)
    logo = models.ImageField(upload_to='page_viewer/static/images/propfirmlogo', null=False, blank=False)
    blog_content = models.TextField(null=True, blank=True)

    objects = models.Manager()

    class Meta:
        db_table = 'prop_firm'


class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.CharField(max_length=400, null=False, blank=False)

    objects = models.Manager()

    class Meta:
        db_table = 'category'


class Questions(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey('Category', on_delete=models.CASCADE)
    question = models.TextField(null=False, blank=False)

    objects = models.Manager()

    class Meta:
        db_table = 'questions'


class Answers(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question = models.ForeignKey('Questions', on_delete=models.CASCADE)
    answer = models.CharField(max_length=500, null=False, blank=False)

    objects = models.Manager()

    class Meta:
        db_table = 'answers'


class Questionnaire(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    question_ids = models.CharField(max_length=300, null=False, blank=False)
    answer_ids = models.CharField(max_length=300, null=False, blank=False)
    prop_firm = models.ForeignKey('PropFirm', on_delete=models.CASCADE)

    objects = models.Manager()

    class Meta:
        db_table = 'questionnaire'


class Discount(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    prop_firm = models.ForeignKey('PropFirm', on_delete=models.CASCADE)
    percentage = models.CharField(max_length=50, null=False, blank=False)
    code = models.TextField(null=False, blank=False)

    objects = models.Manager()

    class Meta:
        db_table = 'discount'
