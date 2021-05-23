# Generated by Django 3.1.3 on 2020-11-21 11:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('magicjourney', '0013_auto_20201121_1041'),
    ]

    operations = [
        migrations.AddField(
            model_name='book',
            name='players',
            field=models.ManyToManyField(blank=True, related_name='equipment_book', to='magicjourney.Player'),
        ),
    ]