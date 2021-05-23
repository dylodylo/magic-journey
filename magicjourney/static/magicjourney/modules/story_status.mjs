import {card, button} from '../script.js'
import {start_journey, choose_family, choose_subjects, choose_house, intro_story, start_expedition, game_over, cave, deep_in_cave, end_game} from './story.mjs'
import {prepare_to_expedition} from './preparation.mjs'
import {diagon_alley} from './diagon_alley.mjs'

function get_story(func_name, narrator)
{
    var url = new URL('http://127.0.0.1:8000/get_story')
    var params = {function_name:func_name}
    url.search = new URLSearchParams(params).toString()
    fetch(url)
    .then(response => response.json())
    .then(data => {
        var story = data.story
        narrator.innerHTML = story
    })
}

function back_to_journey() {
    card.style.display = 'block'
    fetch('/get_story_status')
    .then(response=>response.json())
    .then(data => {
        var status = data.status
        eval(`${status}()`)
        })
    
}

async function update_story(func_name)
{
    await fetch('/save_story_status',{
        method: "PUT",
        body: JSON.stringify({
            function: func_name
        })
    })
}

export {get_story, back_to_journey, update_story}

