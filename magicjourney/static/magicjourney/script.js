import {start_journey, choose_family, choose_subjects, choose_house, intro_story, battle, cave, alohomora, bombarda, another_way, aguamenti} from './modules/story.mjs'
import {get_story, back_to_journey, update_story} from './modules/story_status.mjs'
import {ollivanders, apothecary, bookstore, malkin, items_table, diagon_alley} from './modules/diagon_alley.mjs'
import {buy_item, equip, unequip} from './modules/equipment.mjs'
import {update_skill, house_skills, subjects_skills, skills_points} from './modules/skills.mjs'
import { train_skill, train, get_book, learn_charm} from './modules/preparation.mjs'

export var button
export var narrator
export var card
export var choices
export var player_location
export var scope_window = window
window.ollivanders = ollivanders
window.apothecary = apothecary
window.bookstore = bookstore
window.malkin = malkin
window.buy_item = buy_item
window.equip = equip
window.unequip = unequip
window.train_skill = train_skill
window.train = train
window.get_book = get_book
window.learn_charm = learn_charm
window.skills_points = skills_points
window.battle = battle
window.cave = cave
window.alohomora = alohomora
window.bombarda = bombarda
window.another_way = another_way
window.aguamenti = aguamenti

document.addEventListener('DOMContentLoaded', function() {
    initialize()
})

function initialize(){
    button = document.querySelector('#start')
    narrator = document.querySelector('#narrator')
    card = document.querySelector('.player-card')
    choices = document.querySelector('#choices')
    player_location = document.querySelector('#location')
    var restart_button = document.querySelector('#restart-button')
    if (restart_button) {
        restart_button.onclick = restart_character
    }
    add_toogle_start()
}

function add_toogle_start()
{
    if (button){
        button.onclick = () => start_journey()
    } 
}

function blood_toogle()
{
    var blood_choice = document.querySelector('#family')
    var blood = blood_choice.value
    update_skill(['blood', blood])
    choose_house()
}


function subjects_toogle()
{
    var subjects = document.querySelectorAll('.subject')
    var counter = 0
    var checked_subjects = []
    subjects.forEach(item => {
        if (item.checked == true) {
            counter++
            checked_subjects.push(item.value)
        }
    })
    if (counter != 3) {
        alert("Choose exactly 3 subjects!")
    }

    else {
        subjects_skills(checked_subjects)
        intro_story()
    }  
}

function house_toogle()
{
    var house_choice = document.querySelector("#house")
    var house = house_choice.value

    house_skills(house)
    choose_subjects()
}

function restart_character(){
    if (confirm("This option will delete all your progress. Click OK if you still want restart your character")){
        localStorage.clear()
        fetch("/delete_player")
        .then(response => response.json())
        .then(() => {
            window.location.replace("http://127.0.0.1:8000");
            console.log("Hello")
            initialize()
        })
    }
}

export {house_toogle, subjects_toogle, blood_toogle, initialize}