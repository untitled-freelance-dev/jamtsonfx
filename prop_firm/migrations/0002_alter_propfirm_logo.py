# Generated by Django 3.2.16 on 2023-10-05 21:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('prop_firm', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='propfirm',
            name='logo',
            field=models.ImageField(upload_to='propfirmlogo/'),
        ),
    ]
