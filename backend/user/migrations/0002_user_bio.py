# Generated by Django 5.0 on 2024-02-02 14:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('user', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='bio',
            field=models.CharField(default='', max_length=255),
            preserve_default=False,
        ),
    ]