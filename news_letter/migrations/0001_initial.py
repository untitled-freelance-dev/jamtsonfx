# Generated by Django 3.2 on 2023-09-28 08:11

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='NewsLetter',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.TextField()),
                ('email', models.EmailField(max_length=500)),
                ('status', models.TextField(blank=True, null=True)),
            ],
            options={
                'db_table': 'news_letter',
            },
        ),
    ]
