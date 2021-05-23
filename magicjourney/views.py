from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.db import IntegrityError
from django.urls import reverse
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from .utils import get_all_fields, check_level, get_serialized_fields, get_equipment, get_int_fields, get_equipment_values, change_skill
import json
from django.apps import apps
from markdown2 import Markdown
from .models import User, Player, Wand, Robe, Book, Charm, Creature
import requests
# Create your views here.


def index(request):
    fields_values = []
    try:
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        fields_values = get_all_fields(player)
        button_value = "Return to journey!"
    except:
        player = None
        button_value = "Start your journey!"
    msg = ""
    if (player != None):
        if player.story_status == "choose_family":
            msg = "Your character was created! Click 'Return to journey' to play!"
    
    return render(request, "magicjourney/index.html", {"player": player, "fields": fields_values, "button": button_value, "msg": msg})


def register(request):
    if request.method == "POST":
        username = request.POST['login']
        password = request.POST['password']
        email = request.POST['email']
        confirmation = request.POST['confirmation']
        if password != confirmation:
            return render(request, "magicjourney/register.html", {"message": "Passwords must match."})
        
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "magicjourney/register.html", {"message": "Username already taken."})

        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "magicjourney/register.html")


def userpage(request, username):
    user = User.objects.get(username=username)
    try:
        player = Player.objects.get(user=user)
        equipment = get_equipment(player)
        fields_values = get_all_fields(player)
        charms = Charm.objects.filter(players=player)
    except:
        player = None
        charms = []
        equipment = []
        fields_values = []
    return render(request, "magicjourney/userpage.html", {"player": player, "equipment": equipment, "fields": fields_values, "charms": charms})


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def login_view(request):
    if request.method == "POST":
        username = request.POST['username']
        password = request.POST['password']
        user = authenticate(request, username=username, password=password)

        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "magicjourney/login.html", {"message": "Invalide username and/or password."})
    else:
        return render(request, "magicjourney/login.html")


@login_required
@csrf_exempt
def create_player(request):
    if request.method == "PUT":
        user = User.objects.get(username=request.user.username)
        try:
            Player.objects.get(user=user)
            return JsonResponse({"message": "Player already exists"}, status=202)
        except:
            player = Player.objects.create(user=user)
            player.save()
            wand = Wand.objects.get(pk=4)
            wand.players.add(player)
            wand.save()
            return JsonResponse({"message": "Player created"}, status=201)
    else:
        return JsonResponse(status=404)


@login_required
@csrf_exempt
def update_skill(request):
    
    if request.method == "PUT":
        data = json.loads(request.body)
        skill = data['skill']
        value = data['value']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        if isinstance(value, int):
            if player.story_status == "prepare_to_expedition":
                if player.training_actions <= 0:
                    return JsonResponse({"value": value, "message":"You spend all the time! It's time to go!"})
                player.training_actions -=1
                player.save()
            field = player._meta.get_field(skill)
            new_value = change_skill(player, skill, value)
            if skill == 'xp':
                check_level(player)
            return JsonResponse({"value": new_value, "message": None},status=201)

        else:
            setattr(player,skill,value)
            player.save()
            return JsonResponse({"value": value, "message":None},status=201)


@login_required
def get_story_status(request):
    user = User.objects.get(username=request.user.username)
    player = Player.objects.get(user=user)
    status = player.story_status
    return JsonResponse({"status": status}, status=200)


@login_required
@csrf_exempt
def save_story_status(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        function = data['function']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        player.story_status = function
        player.save()
        return JsonResponse({}, status=201)


@login_required
def get_all_items(request):
    model_name = request.GET.get('model', '')
    model = apps.get_model(User._meta.app_label, model_name, True)
    items = model.objects.all()
    fields = get_serialized_fields(model)
    items_list = [item.getlist() for item in items]
    if model_name == "Wand":
        items_list.remove(items_list[3]) #remove old wand
    return JsonResponse([items_list, fields], status=200, safe=False)


@login_required
def get_story(request):
    story_name = request.GET.get('function_name', '')
    story_file = open("stories/"+story_name+".txt", "r")
    story = story_file.read()
    return JsonResponse({"story": story}, status=200)


@login_required
@csrf_exempt
def change_equipment(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        category = data['category']
        item_id = data['item']
        model = apps.get_model(User._meta.app_label, category, True)
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        item = model.objects.get(id=item_id)

        current_item = getattr(player, category.lower())
        if current_item != None and category != "Book":
            skills_to_remove = get_equipment_values(current_item)
            #skills_to_remove = [s[1]*(-1) for s in skills_to_remove] #change value of skill from + to -
            for skill in skills_to_remove:
                change_skill(player, skill[0], -skill[1])
        setattr(player, category.lower(), item)
        skills = get_equipment_values(item)
        for skill in skills:
            change_skill(player, skill[0], skill[1])
        player.save()
        return JsonResponse({"item": item.__str__(), "skills": skills}, status=201)


@login_required
@csrf_exempt
def buy_item(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        item_id = data['item_id']
        model_name = data['model_name']
        model = apps.get_model(User._meta.app_label, model_name, True)
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        item = model.objects.get(id=item_id)

        if player in item.players.all():
            return JsonResponse({"message": "You already have this!", "status": False})
        elif player.money < item.price_knuts:
            return JsonResponse({"message": "You don't have enough money!", "status": False})
        else:
            item.players.add(player)
            change_skill(player, 'money', -item.price_knuts)
            #add story based on bought item category
            return JsonResponse({"money": player.money_in_galleons(), "story":"story", "message":"You bought item", "status": True}, status=201)
            

@login_required
@csrf_exempt
def unequip(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        item_name = data['item']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        item = getattr(player, item_name)
        print(item)
        setattr(player, item_name, None)
        player.save()
        skills = get_equipment_values(item)
        for skill in skills:
            change_skill(player, skill[0], -skill[1])
        return JsonResponse({}, status=201)


def faq(request):
    help_file = open("help/faq.md", "r")
    faq = help_file.read()
    markdowner = Markdown()

    return render(request, "magicjourney/faq.html", {"faq": markdowner.convert(faq)})


@login_required
def book(request):
    user = User.objects.get(username=request.user.username)
    player = Player.objects.get(user=user)
    if player.book == None:
        return JsonResponse({"status":False, "message":"You don't have any book equiped. Go to your player and equip book!"})

    charms = [player.book.charm1.getlist(), player.book.charm2.getlist(), player.book.charm3.getlist()]
    return JsonResponse({"status": True, "charms": charms, "book_name": player.book.name})



@login_required
@csrf_exempt
def learn_charm(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        charm_name = data["charm"]
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        charm = Charm.objects.get(name=charm_name)
        skill = charm.required_skill
        if player in charm.players.all():
            return JsonResponse({"status": False, "message":"You already know this charm"})
        if player.training_actions <= 0:
            return JsonResponse({"status": False, "message":"You spend all the time! It's time to go!"})
        if skill != None and skill != '':
            skill_value = getattr(player, skill)
            if skill_value < charm.required_value:
                return JsonResponse({"status": False, "message":f"Required skill ({skill}: {charm.required_value}) is too low"})

        charm.players.add(player)
        setattr(player, 'training_actions', (getattr(player, 'training_actions')-1))
        player.save()
        return JsonResponse({"status": True, "message":f"You have learned charm {charm_name}"})

@login_required
@csrf_exempt
def set_skill(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        skill_name = data["skill_name"]
        skill_value = data["skill_value"]
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        setattr(player, skill_name.replace("\\ ", "_"), skill_value)
        player.save()
        return JsonResponse({}, status=201)

@login_required
def get_creature(request):
    creature_name = request.GET.get("creature")
    creature = Creature.objects.get(name=creature_name)
    return JsonResponse({"params": creature.get_params(), "xp": creature.xp}, status=201)

@login_required
@csrf_exempt
def check_spell(request):
    if request.method == "PUT":
        data = json.loads(request.body)
        spell_name = data['spell']
        user = User.objects.get(username=request.user.username)
        player = Player.objects.get(user=user)
        spell = Charm.objects.get(name=spell_name)
        if player in spell.players.all():
            print("True")
            return JsonResponse({"known": True}, status=201)
        else:
            return JsonResponse({"known": False}, status=201)

@login_required
@csrf_exempt
def delete_player(request):
    user = User.objects.get(username=request.user.username)
    player = Player.objects.get(user=user)
    player.delete()
    return JsonResponse({}, status=201)