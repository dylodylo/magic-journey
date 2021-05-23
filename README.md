# Magic Journey

1. What is project about?
2. How navigate through website
3. Brief look at files
4. Setup
5. Things to improve
6. Some things I'm proud about

# 1. What is project about?

Magic Journey is simple role-play game made for Harvard CS50Web course as capstone. Website was made with Django and JavaScript.

# 2. How navigate through website

#### Home

As not logged in you could see only top navbar and project title. To start playing you have to register/login.

After register/login you could see button under title "Start your journey!". It creates your character. Now click "Return to journey!" (you will see this button everytime you log in to website) and you now can play! You have story in middle, your character card on right and action buttons on bottom.

#### Player page

After clicking your name next to "Start" button you could see you character card, when you can spend your skills points, your current equipment and items, that you can equip. Every player starts with his wand only, but you can buy items on Diagon Alley.

#### FAQ

There you can find answers to your questions about game.

# 3. Brief look at files

#### utils.py

Contain piece of code too large to write in views.py or these one I use multiple times.

#### Templates

Some simple htmls for main site, register, login and userpage. I think userpage it's quite nice, put much work to implement skills points and equip/unequip.

#### Static

This is where my fight with CSS and JS took place. JS files have been split to modules. In overwiew each module should contain functions from another place in game or another game system.

#### models.py

For Magic Journey I've created 6 models:
Player - created for each user. Containt all skills and equipment.
Wand, Robe, Book - equipment classes. Wands and robes have own statistics, books have charms.
Charms - could be learned by player, have various effects.
Creature - beasts player fight against.

#### Stories

Text files with stories that appears while playing.

#### Help

Folder with FAQ file.

# 4. Setup

```
git clone https://github.com/dylodylo/cs50web.git
cd finalproject/finalproject
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```

# 5. Things to improve

- Registration - I've tried to implement account activation by email and password reset, but still can't do that.

- Deploy - I've tried deploy website to Heroku, but can't deal with static files.

# 6. Some things I'm proud about

- My fight with JavaScript has ended with success. Files are quite in order and could be reused if I ever would like to expand game or create fight or skills system for another game.

- Website look isn't the best, but legible and tidy.

- Ended CS50web course.

- I've made my own Harry Potter based game! :)
