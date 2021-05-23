import {initialize, house_toogle, subjects_toogle, blood_toogle, player_location, button, narrator, choices} from '../script.js'
import {get_story, back_to_journey, update_story} from './story_status.mjs'
import {diagon_alley} from './diagon_alley.mjs'
import {update_skill} from './skills.mjs'
import {before_fight, start_fight, battle} from './fights.mjs'

function start_journey(button, narrator, card) {
    //crete new Player model
    fetch('/create_player', {
        method: "PUT"
    })
    .then(response => {
        status = response.status
        if (status == 202){
            back_to_journey()
        }
        else{
            location.reload()
            console.log(narrator)
            if (narrator === undefined) {
                narrator = document.querySelector('#narrator')
                card = document.querySelector('.player-card')
                button = document.querySelector('#start')
            }
            
            narrator.innerHTML = "This is start of great journey!"
            narrator.style.display = 'block'
            card.style.display = 'block'
            button.onclick = choose_family()
        }
    })
}


function choose_family() {
    document.querySelector("#msg").style.display = 'none'
    update_story(choose_family.name)
    player_location.innerHTML = "Home"
    get_story(choose_family.name, narrator)
    narrator.style.display = 'block'
    button.innerHTML = "This is my family!"
    choices.innerHTML = `<select id="family">
    <option value="Muggle">Muggle</option>
    <option value="Half-blood">Half-blood</option>
    <option value="Pure-blood">Pure-blood</option>
    </select>`
    choices.style.display = "block"
    button.onclick = blood_toogle
}


function choose_subjects(){
    update_story(choose_subjects.name)

    narrator.style.display = 'block'
    choices.style.display = 'block'
    get_story(choose_subjects.name, narrator)
    button.innerHTML = "I loved these subjects"
    choices.innerHTML = `<input type="checkbox" id="charms" class="subject" value="charms">
    <label for="charms"> Charms</label><br>
    <input type="checkbox" id="dada" class="subject" value="dada">
    <label for="dada"> Defence Against the Dark Arts</label><br>
    <input type="checkbox" id="flying" class="subject" value="flying">
    <label for="flying"> Flying</label><br>
    <input type="checkbox" id="herbology" class="subject" value="herbology">
    <label for="herbology"> Herbology</label><br>
    <input type="checkbox" id="potions" class="subject" value="potions">
    <label for="potions"> Potions</label><br>
    <input type="checkbox" id="transfiguration" class="subject" value="transfiguration">
    <label for="transfiguration"> Transfiguration</label><br>  `

    button.onclick = subjects_toogle
}

function choose_house() {
    update_story(choose_house.name)

    narrator.style.display = "block"
    choices.style.display = "block"
    button.onclick = house_toogle
    get_story(choose_house.name, narrator)
    button.innerHTML = "This was my house!"
    choices.innerHTML = `<select id="house">
    <option value="Gryffindor">Gryffindor</option>
    <option value="Ravenclaw">Ravenclaw</option>
    <option value="Hufflepuff">Hufflepuff</option>
    <option value="Slytherin">Slytherin</option>
    </select>`
}

function intro_story()
{
    update_story(intro_story.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    get_story(intro_story.name, narrator)
    document.querySelector("#money").innerHTML = "2 g 0 s 14 k"
    button.innerHTML = "Go to Diagon Alley"
    button.onclick = diagon_alley
    console.log(button.innerHTML)
}

function start_expedition(){
    player_location.innerHTML = "Forrest in northern Scotland"
    update_story(start_expedition.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    get_story(start_expedition.name, narrator)
    button.innerHTML = "Start fight!"
    var after_fight = cave
    button.onclick = () => before_fight("Hinkypunk",[], after_fight)
}

function game_over(){
    localStorage.clear()
    alert("You're dead!")
    update_story(game_over.name)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    document.querySelector("#creature").style.display = 'none'
    get_story(game_over.name, narrator)
    button.style.display = 'none'
}

function cave(){
    player_location.innerHTML = "Cave"
    localStorage.clear()
    update_story(cave.name)
    narrator.style.display = 'block'
    choices.style.display = 'block'
    document.querySelector("#creature").style.display = 'none'
    get_story(cave.name, narrator)

    choices.innerHTML =`<button onclick="alohomora()">Use Alohomora</button>
                        <button onclick="bombarda()">Use Bombarda</button>
                        <button onclick="another_way()">Find another way</button>`
    button.style.display = 'none'
}

function check_spell(spell, callback){
    fetch('/check_spell',{
        method: "PUT",
        body: JSON.stringify({
            spell: spell
        })
    })
    .then(response => response.json())
    .then(data => {
        var known = data.known
        callback(known)
    })
}

function alohomora(){
    check_spell("Alohomora", function(known){
        if (known == false){
            alert("You don't know this spell!")
            cave()
        }
        else if (known == true){
            choices.style.display = 'none'
            narrator.innerHTML = "You open doors with Alohomora. You could go on."
            button.style.display = 'block'
            button.innerHTML = "Go on!"
            button.onclick = () => deep_in_cave()
        }
    })

}

function bombarda(){
    check_spell("Bombarda", function(known){
        if (known == false){
            alert("You don't know this spell!")
            cave()
        }
        else if (known == true){
            choices.style.display = 'none'
            narrator.innerHTML = "BOOOOM! Echo multiplies sound of explosion. But doors shattered to pieces and you now could go on."
            button.style.display = 'block'
            button.innerHTML = "Go on!"
            button.onclick = () => deep_in_cave()
        }
    })
}

function another_way(){
    choices.style.display = 'none'
    narrator.innerHTML = "You found narrow passage on your right. You take depth breath and start slowly squeeze through. Suddenly your foot find nothing but abyss. You fall down and lost 5 HP..."
    button.innerHTML = "AAAAAAA!"
    button.style.display = 'block'
    button.onclick = () => {
        var lost_hp = -5
        update_skill(["hp", lost_hp])
        var player_hp = parseInt(document.querySelector("#hp-value").innerHTML) + lost_hp
        console.log(player_hp)
        if (player_hp > 0){
            button.innerHTML = "... But it looks that you find new corridor!"
            button.onclick = () => deep_in_cave()
        }
        else {
            game_over()
        }
    }    
}

function deep_in_cave(){
    player_location.innerHTML = "Cave"
    update_story(deep_in_cave.name)
    narrator.style.display = 'block'
    get_story(deep_in_cave.name, narrator)
    button.innerHTML = "Fight"
    button.onclick = () => before_fight("Salamander",["aguamenti"], end_game)
}

function aguamenti(){
    check_spell("Aguamenti", function(known){
        if (known == false){
            alert("You don't know this spell!")
            return
        }
        else if (known == true){
            localStorage.setItem('creature-defence', 0)
            localStorage.setItem('creature-defence-c', 0)
            alert("You use Agauamenti to extinguish salamander. It lose some defence.")
            start_fight()
        }
    })
}

function end_game(){
    player_location.innerHTML = "Cave"
    localStorage.clear()
    update_story(end_game.name)
    get_story(end_game.name, narrator)
    narrator.style.display = 'block'
    choices.style.display = 'none'
    button.style.display = 'none'
    document.querySelector("#creature").style.display = 'none'
}

export {start_journey, choose_family, choose_subjects, choose_house, intro_story, start_expedition, battle, cave, alohomora, game_over, bombarda, another_way, deep_in_cave, end_game, aguamenti}