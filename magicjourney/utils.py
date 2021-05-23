from django.apps import apps
from django.db.models.fields import IntegerField, AutoField

def get_all_fields(object):
    no_fields = ["id", "user", "story_status", "wand", "book", "robe", 'money', 'price_knuts', "training_actions"]
    fields = []
    for f in object._meta.get_fields():
        try:
            fields.append((f.verbose_name, f.name))
        except:
            pass
    #[(f.verbose_name, f.name) for f in object._meta.get_fields()]
    fields_values = []
    for field in fields:
        if field[1] not in no_fields:       
            value = getattr(object, field[1])
            fields_values.append((field[0], value))
    return fields_values


def check_level(player):
    while player.level*100 <= player.xp:
        setattr(player,'level',player.level+1)
        setattr(player,'skills_points', player.skills_points + player.level + 1)
        setattr(player,'hp', player.hp + 10)
        player.save()

def get_serialized_fields(object):
    no_fields = ["player", "players", 'price_knuts']
    fields = [f.name for f in object._meta.get_fields()]
    fields = [f.capitalize() for f in fields if not f in no_fields]
    return fields


def get_equipment(player):
    no_models = ["User", "Player", "Charm", "Creature"]
    equipment = {}
    models = apps.get_app_config('magicjourney').get_models()
    for model in models:
        if model.__name__ not in no_models:
            items = model.objects.filter(players=player)
            equipment[model.__name__] = items

    return equipment


def get_int_fields(model): 
    skills = []
    fields = model._meta.get_fields()
    for field in fields:
        if isinstance(field, IntegerField) and not isinstance(field, AutoField):
            skills.append(field)
    skills.remove(model._meta.get_field('price_knuts'))
    return skills
        

def get_equipment_values(item):
    fields = get_int_fields(item)
    fields_names = []
    for f in fields:
        try:
            fields_names.append(f.name)
        except:
            print(f)
    fields_values = []
    for field in fields_names: 
        value = getattr(item, field)
        fields_values.append([field, value])
    return fields_values


def change_skill(player, skill, value):
    current_value = getattr(player, skill)
    setattr(player, skill, current_value+value)
    player.save()
    return current_value+value