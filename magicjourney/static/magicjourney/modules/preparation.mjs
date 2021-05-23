import {house_toogle, subjects_toogle, blood_toogle, player_location, button, narrator, choices} from '../script.js'
import {get_story, back_to_journey, update_story} from './story_status.mjs'
import {update_skill} from './skills.mjs'
import {start_expedition} from './story.mjs'

function prepare_to_expedition()
{
    player_location.innerHTML = "Home"
    var table = document.querySelector("#table")
    table.style.display = 'none'
    update_story(prepare_to_expedition.name)
    narrator.style.display = 'block'
    choices.style.display = 'block'
    get_story(prepare_to_expedition.name, narrator)
    choices.innerHTML =`<button id="train-charms" onclick="train_skill(this)" data-skill="charms">Train charms</button>
                        <button id="train-transfiguration" onclick="train_skill(this)" data-skill="transfiguration">Train transfiguration</button>
                        <button id="train-flying" onclick="train_skill(this)" data-skill="flying">Train flying</button>
                        <button id="learn-charm" onclick="get_book()">Learn charm from equiped book</button>`
    button.innerHTML = "Go to expedition!"
    button.onclick = start_expedition
    
}

function train_skill(train_button){
    var skill = train_button.getAttribute("data-skill")
    if (skill === "flying"){
        skill = "hp"
    }
    narrator.innerHTML = `This training give you 5 points of ${skill}!`
    choices.innerHTML = `<button id="train-charms" onclick="train(this)" data-skill="${skill}">Train!</button>`
    button.innerHTML = "Back"
    button.onclick = prepare_to_expedition
}

function train(train_button){
    var skill = train_button.getAttribute("data-skill")
    update_skill([skill, 5])
}

function get_book(){
    fetch('/get_book')
    .then(response => response.json())
    .then(data => {
        var status = data.status
        if (!status) {
            var message = data.message
            alert(message)
        }
        else {
            var charms = data.charms
            var name = data.book_name
            books_charms(name,charms)
        }
    })
}

function books_charms(name, charms){
    narrator.innerHTML = `Charms you can learn from book ${name}:`
    choices.style.display = 'None'
    var table = document.querySelector("#table")
    table.style.display = 'block'
    button.innerHTML = "Back"
    button.onclick = prepare_to_expedition
    charms.forEach(charm => { 
        var row = table.insertRow()  
        var cell1 = row.insertCell()
        cell1.innerHTML = `<div class="tooltip">${charm[0]}<span class="tooltiptext">${charm[1]}</span></div>`
        var cell2 = row.insertCell()
        cell2.innerHTML = `<button onclick="learn_charm(this)" data-charm="${charm[0]}">Learn</a>`

    })

}


function learn_charm(charm_button){
    var charm = charm_button.getAttribute("data-charm")
    fetch('/learn_charm', {
        method: "PUT",
        body: JSON.stringify({
            charm: charm
        })
    })
    .then(response => response.json())
    .then(data => {
        var status = data.status
        var message = data.message
        if (!status){
            alert(message)
        }
        else {
            narrator.innerHTML = message
        }
    })
}


export {prepare_to_expedition, train_skill, train, get_book, learn_charm}