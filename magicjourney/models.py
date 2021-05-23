from django.contrib.auth.models import AbstractUser
from django.db import models
# Create your models here.

class User(AbstractUser):
    pass
    
class Player(models.Model):
    blood_choices = [
        ("Muggle", "Muggle"),
        ("Half-blood", "Half-blood"),
        ("Pure-blood", "Pure-blood")
    ]
    houses = [
        ("Gryffindor", "Gryffindor"),
        ("Ravenclaw", "Ravenclaw"),
        ("Hufflepuff", "Hufflepuff"),
        ("Slytherin", "Slytherin")
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    story_status = models.CharField(default="start", max_length=50)
    skills_points = models.IntegerField(default=5)
    xp = models.IntegerField(default = 0)
    level = models.IntegerField(default=1)
    blood = models.CharField(choices=blood_choices, blank=True, max_length=30)
    house = models.CharField(choices=houses, blank=True, max_length=30)
    hp = models.IntegerField(default=0)
    defence = models.IntegerField(default=0)
    charms = models.IntegerField(default=0)
    transfiguration = models.IntegerField(default=0)
    potions = models.IntegerField(default=0)
    charisma = models.IntegerField(default=0)
    money = models.IntegerField(default=2500) #in knuts
    wand = models.ForeignKey('Wand', on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name="wand")
    robe = models.ForeignKey('Robe', on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name="robe")
    book = models.ForeignKey('Book', on_delete=models.CASCADE, blank=True, null=True, default=None, verbose_name="book")
    training_actions = models.IntegerField(default=4)

    def __str__(self):
        return f"{self.user}"

    
    def money_in_galleons(self):
        galleons = self.money // 493
        sickles = (self.money - galleons*493) // 29
        knuts = self.money - galleons*493 - sickles*29
        return f"{galleons} g {sickles} s {knuts} k"
    

class Wand(models.Model):
    length = models.FloatField(default=10)
    flexibility = models.CharField(max_length=30)
    core = models.CharField(max_length=40)
    wood = models.CharField(max_length=30)
    defence = models.IntegerField(default=0)
    charms = models.IntegerField(default=0)
    transfiguration = models.IntegerField(default=0)
    potions = models.IntegerField(default=0)
    price_knuts = models.IntegerField(default=0)
    price = models.CharField(max_length=50, blank=True)
    players = models.ManyToManyField(Player, blank=True, related_name="equipment_wand")

    def __str__(self):
        return f"{self.length}\", {self.wood}, {self.core}"

    def getlist(self):
        return [self.id, self.length, self.flexibility, self.core, self.wood, self.defence, self.charms, self.transfiguration, self.potions, self.price]

    def price_in_galleons(self):
        galleons = self.price_knuts // 493
        sickles = (self.price_knuts - galleons*493) // 29
        knuts = self.price_knuts - galleons*493 - sickles*29
        return f"{galleons} g {sickles} s {knuts} k"

    def save(self, *args, **kwargs):
        self.price = self.price_in_galleons()
        super(Wand, self).save(*args, **kwargs)


class Robe(models.Model):
    name = models.CharField(max_length=30)
    hp = models.IntegerField(default=0)
    defence = models.IntegerField(default=0)
    price_knuts = models.IntegerField(default=0)
    price = models.CharField(max_length=50, blank=True)
    players = models.ManyToManyField(Player, blank=True, related_name="equipment_robe")

    def __str__(self):
        return f"{self.name}"

    def serialize(self):
        return {
            "name": self.name,
            "hp": self.hp,
            "defence": self.defence,
            "price": self.price
        }

    def getlist(self):
        return [self.id, self.name, self.hp, self.defence, self.price]

    
    def price_in_galleons(self):
        galleons = self.price_knuts // 493
        sickles = (self.price_knuts - galleons*493) // 29
        knuts = self.price_knuts - galleons*493 - sickles*29
        return f"{galleons} g {sickles} s {knuts} k"

    def save(self, *args, **kwargs):
        self.price = self.price_in_galleons()
        super(Robe, self).save(*args, **kwargs)



class Charm(models.Model):
    name = models.CharField(max_length=30)
    description = models.CharField(max_length=255)
    required_skill = models.CharField(max_length=20, blank=True)
    required_value = models.IntegerField(default=0)
    effects_skill = models.CharField(max_length=20, blank=True)
    effects_value = models.IntegerField(default=0)
    players = models.ManyToManyField(Player, blank=True, related_name="known_charms")
    

    def __str__(self):
        return f"{self.name}"

    def getlist(self):
        return [self.name, self.description, self.required_skill, self.required_value, self.effects_skill, self.effects_value]


class Book(models.Model):
    name = models.CharField(max_length=30)
    charm1 = models.ForeignKey(Charm, blank=True, on_delete=models.CASCADE, related_name="first_charm")
    charm2 = models.ForeignKey(Charm, blank=True, on_delete=models.CASCADE, related_name="second_charm")
    charm3 = models.ForeignKey(Charm, blank=True, on_delete=models.CASCADE, related_name="third_charm")
    price_knuts = models.IntegerField(default=0)
    price = models.CharField(max_length=50, blank=True)
    players = models.ManyToManyField(Player, blank=True, related_name="equipment_book")

    def __str__(self):
        return f"{self.name}"

    def getlist(self):
        return [self.id, self.name, self.charm1.__str__(), self.charm2.__str__(), self.charm3.__str__(), self.price]

    def price_in_galleons(self):
        galleons = self.price_knuts // 493
        sickles = (self.price_knuts - galleons*493) // 29
        knuts = self.price_knuts - galleons*493 - sickles*29
        return f"{galleons} g {sickles} s {knuts} k"

    def save(self, *args, **kwargs):
        self.price = self.price_in_galleons()
        super(Book, self).save(*args, **kwargs)


class Creature(models.Model):
    name = models.CharField(max_length=40)
    hp = models.IntegerField(default=0)
    xp = models.IntegerField(default=0)
    attack = models.IntegerField(default=0)
    d_trans = models.IntegerField(default=0)
    d_charms = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.name}"

    def get_params(self):
        return {
            "Name": self.name,
            "HP": self.hp,
            "Attack": self.attack,
            "Defence_t": self.d_trans,
            "Defence_c": self.d_charms
        }