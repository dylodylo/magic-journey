import { button, choices} from "../script.js"
import { update_skill } from "./skills.mjs"
import { aguamenti, game_over } from "./story.mjs"


function before_fight(creature, spells_list, after_fight){
    var url = new URL('http://127.0.0.1:8000/get_creature')
    var params = {creature: creature}
    url.search = new URLSearchParams(params).toString()
    fetch(url)
    .then(response => response.json())
    .then(data => {
        var params = data.params
        var xp = data.xp
        start_fight(params, xp, spells_list, after_fight)
    })
}

function start_fight(params, xp, spells_list, after_fight)
{
    if (localStorage.getItem('fightStarted') === null){
        localStorage.setItem('fightStarted', true)
        localStorage.setItem("sum-of-attacks", 0)
        document.querySelector("#creature-hp-value").innerHTML = params["HP"]
        var player_hp = document.querySelector("#hp-value").innerHTML
        var defence_t = params["Defence_t"]
        var defence_c = params["Defence_c"]
        localStorage.setItem("player-hp", player_hp)
        localStorage.setItem("creature-defence", defence_t)
        localStorage.setItem("creature-hp", params["HP"])
        localStorage.setItem("creature-defence-c", defence_c)
        document.querySelector("#creature-defence-charms-value").innerHTML = defence_c
        document.querySelector("#creature-defence-trans-value").innerHTML = defence_t
        localStorage.setItem("creature-xp", xp)
    }

    else {
        var player_hp = localStorage.getItem('player-hp')
        document.querySelector("#hp-value").innerHTML = player_hp
        document.querySelector("#creature-hp-value").innerHTML = localStorage.getItem('creature-hp')
        var defence_t = localStorage.getItem('creature-defence')
        var defence_c = localStorage.getItem('creature-defence-c')
        document.querySelector("#creature-defence-trans-value").innerHTML = defence_t
        document.querySelector("#creature-defence-charms-value").innerHTML = defence_c
    }
    var name = params["Name"]
    var attack = params["Attack"]
    document.querySelector("#creature-name-value").innerHTML = name
    document.querySelector("#creature-attack-value").innerHTML = attack
    document.querySelector("#creature").style.display = 'block'

    var player_defence = document.querySelector("#defence-value").innerHTML
    var player_charms = document.querySelector("#charms-value").innerHTML
    var player_transfiguration = document.querySelector("#transfiguration-value").innerHTML


    narrator.style.display = 'block'
    narrator.innerHTML = ''
    choices.style.display = 'none'
    button.style.display = 'none'

    document.querySelector("#attack-buttons").style.display = 'block'
    document.querySelector("#charm-attack").onclick = () => battle("attack", player_charms, defence_c, after_fight)
    document.querySelector("#trans-attack").onclick = () => battle("transfiguration", player_transfiguration, defence_t, after_fight)
    var spells = document.querySelector("#spells")
    spells_list.forEach(spell => {
        var new_spell = document.createElement("button")
        var spell_capitalized = spell.charAt(0).toUpperCase() + spell.slice(1)
        new_spell.innerHTML = `Cast ${spell_capitalized}`
        new_spell.onclick = window[spell]
        spells.appendChild(new_spell)
    })
}


function battle(action, value, defence, after_fight){
    var player_hp = parseInt(document.querySelector("#hp-value").innerHTML)
    var hp = parseInt(document.querySelector("#creature-hp-value").innerHTML)
    if (action === "attack"){
        if (value > defence){
            var attack_strength = value-defence
            hp -= attack_strength
            localStorage.setItem('creature-hp', hp)
            if (hp<=0) {
                var xp = parseInt(localStorage.getItem("creature-xp"))
                alert(`You attack with ${attack_strength} power. You kill the beast. You get ${xp} xp. Refresh to see your progress.`)
                update_skill(["hp", -localStorage.getItem("sum-of-attacks")])
                update_skill(["xp", xp])
                document.querySelector("#attack-buttons").style.display = 'none'
                after_fight()
            }
        }
        else {
            var attack_strength = 0
        }
        var attack = parseInt(document.querySelector("#creature-attack-value").innerHTML)
        var player_defence = parseInt(document.querySelector("#defence-value").innerHTML)    
        if (attack>player_defence){
            var creature_attack_value = attack-player_defence
            player_hp -= creature_attack_value
            var sum_of_attacks = parseInt(localStorage.getItem("sum-of-attacks")) + creature_attack_value
            localStorage.setItem("sum-of-attacks", sum_of_attacks)
            localStorage.setItem('player-hp', player_hp)
        }
        else {
            var creature_attack_value = 0
        }
        if(player_hp<=0){
            update_skill(["hp", -localStorage.getItem("sum-of-attacks")])
            document.querySelector("#attack-buttons").style.display = 'none'
            game_over()
        }
        else if (hp>0){
            alert(`You attack with ${attack_strength} power. Beast has ${hp} hp left. Beast attack with ${creature_attack_value} power. You have ${player_hp} left`)
            document.querySelector("#hp-value").innerHTML = player_hp
            document.querySelector("#creature-hp-value").innerHTML = hp
            start_fight
        }
    }         
    else if (action == "transfiguration"){
        defence = localStorage.getItem("creature-defence")
        if (value>defence){
            var attack_strength = value-defence
            defence -= attack_strength
            localStorage.setItem("creature-defence", defence)
            if (defence < 0){
                var xp = parseInt(localStorage.getItem("creature-xp"))
                alert(`You tranfigure creature into stone. You get ${xp} xp. Refresh to see your progress.`)
                update_skill(["hp", -localStorage.getItem("sum-of-attacks")])
                update_skill(["xp", xp])
                document.querySelector("#attack-buttons").style.display = 'none'
                after_fight()
            }
        }
        else {
            var attack_strength = 0
        }
        var attack = parseInt(document.querySelector("#creature-attack-value").innerHTML)
        var player_defence = parseInt(document.querySelector("#defence-value").innerHTML)    
        if (attack>player_defence){
            var creature_attack_value = attack-player_defence
            player_hp -= creature_attack_value
            var sum_of_attacks = parseInt(localStorage.getItem("sum-of-attacks")) + creature_attack_value
            localStorage.setItem("sum-of-attacks", sum_of_attacks)
            localStorage.setItem('player-hp', player_hp)
        }
        else {
            var creature_attack_value = 0
        }
        if(player_hp<=0){
            console.log(player_hp)
            update_skill(["hp", -localStorage.getItem("sum-of-attacks")])
            document.querySelector("#attack-buttons").style.display = 'none'
            game_over()
        }
        else if (defence>0){
            alert(`You attack with ${attack_strength} power. Beast has ${defence} defence left. Beast attack with ${creature_attack_value} power. You have ${player_hp} left`)
            document.querySelector("#hp-value").innerHTML = player_hp
            document.querySelector("#creature-defence-trans-value").innerHTML = defence
            start_fight
        }
}
}

export {before_fight, start_fight, battle}