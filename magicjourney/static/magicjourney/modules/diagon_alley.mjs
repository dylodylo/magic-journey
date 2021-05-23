import {choices, button, narrator, player_location} from '../script.js'
import {update_story, get_story} from './story_status.mjs'
import {prepare_to_expedition} from './preparation.mjs'

function ollivanders(){
    choices.style.display = 'none'
    player_location.innerHTML = "Ollivanders"
    get_story(ollivanders.name, narrator)
    items_table("Wand")
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley
}

function apothecary(){
    choices.style.display = 'none'
    player_location.innerHTML = "Apothecary"
    get_story(apothecary.name, narrator)
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley
}

function bookstore(){
    choices.style.display = 'none'
    player_location.innerHTML = "Whizz Hard Books"
    get_story(bookstore.name, narrator)
    items_table("Book")
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley
}

function malkin(){
    player_location.innerHTML = "Madam Malkin's Robes for All Occasions"
    choices.style.display = 'none'
    get_story(malkin.name, narrator)
    items_table("Robe")
    button.innerHTML = "Go back to Diagon Alley"
    button.onclick = diagon_alley

}

function items_table(model_name, ){
    var url = new URL('http://127.0.0.1:8000/get_all_items')
    var params = {model:model_name}
    var table = document.querySelector("#table")
    table.innerHTML = ''
    table.style.display = 'block'
    url.search = new URLSearchParams(params).toString()
    fetch(url)
    .then(response => response.json())
    .then(element => {
        var fields = element[1]
        var items = element[0]
        fields.forEach(field => {
            if (field != "Id"){
                var new_column = document.createElement("th")
                new_column.innerHTML = field
                table.append(new_column)
            }
        })
        items.forEach(item => {
            var row = table.insertRow()
            
            for (var i = 1; i < item.length; i++){
                var cell = row.insertCell()
                cell.innerHTML = item[i]
            }
            var cell = row.insertCell()
            cell.innerHTML = `<button onclick="buy_item(this)" data-id="${item[0]}" data-model="${model_name}">Buy</a>`
        })
    
    })
}


function diagon_alley(){
    update_story(diagon_alley.name)
    button.innerHTML = "Prepare to expedition"
    document.querySelector('#table').style.display = 'none'
    console.log(button.innerHTML)
    //button.onclick = () => alert("Function not implemented yet!")
    button.onclick = prepare_to_expedition
    console.log(button)
    player_location.innerHTML = "Diagon Alley"
    get_story(diagon_alley.name, narrator)
    narrator.style.display = 'block'
    choices.innerHTML = `<button id="ollivanders" onclick="ollivanders()">Go to Ollivanders</button>
    <button id="malkin" onclick="malkin()">Go to Madam Malkin's Robes for All Occasions</button>
    <button id="apothecary" onclick="apothecary()">Go to Apothecary</button>
    <button id="bookstore" onclick="bookstore()">Whizz Hard Books</button>`
    choices.style.display = "block"

}

export {ollivanders, apothecary, bookstore, malkin, items_table, diagon_alley}