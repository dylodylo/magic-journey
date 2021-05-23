async function update_skill(skills) {
    await fetch('/update_skill', {
            method: "PUT",
            body: JSON.stringify({
                skill: skills[0],
                value: skills[1]
            })
        })
        .then(response => response.json())
        .then(data => {
            var message = data.message
            if (!message){
                var new_value = data.value
                var field = document.querySelector(`#${skills[0]}-value`)
                field.innerHTML = new_value
            }
            else {
                alert(message)
            }
        })
}

async function house_skills(house){
    await update_skill(['house', house])
    switch (house) {
        case "Gryffindor":
            await update_skill(['transfiguration', 10])
            await update_skill(['charisma', 10])
            break
        
        case "Hufflepuff":
            await update_skill(['hp', 10])
            await update_skill(['charisma', 10])
            break

        case "Ravenclaw":
            await update_skill(['charms', 10])
            await update_skill(['defence', 10])

        case "Slytherin":
            await update_skill(['potions', 10])
            await update_skill(['hp', 10])
    }
}

async function subjects_skills(subjects){
    var skill_to_update = []
    for (const item of subjects) {
        switch (item) {
            case "charms":
                skill_to_update.push(["charms", 10])
                break

            case "dada":
                skill_to_update.push(["defence", 5])
                skill_to_update.push(["charms", 5])
                break
            
            case "flying":
                skill_to_update.push(["hp", 5])
                skill_to_update.push(["defence", 5])
                break
            
            case "herbology":
                skill_to_update.push(["hp", 5])
                skill_to_update.push(["potions", 5])
                break
            
            case "potions":
                skill_to_update.push(["potions", 10])
                break
            
            case "transfiguration":
                skill_to_update.push(["transfiguration", 10])
                break
        }
    }

    for (const item of skill_to_update) {
        await update_skill(item)
    }
}

function skills_points(){
    var buttons_spans = document.querySelectorAll(".plus-minus")
    buttons_spans.forEach(element =>{
        element.style.display = 'block'
    })

    document.querySelectorAll(".plus").forEach(element => {
        var skill = element.getAttribute("data-skill")
        element.onclick = () => plus_point(skill)
    })
    document.querySelectorAll(".minus").forEach(element => {
        var skill = element.getAttribute("data-skill")
        var skill_value = document.querySelector(`#${skill}-value`).textContent
        element.onclick = () => minus_point(skill, skill_value)
    })

    var skills_button = document.querySelector("#skills_points_button")
    skills_button.innerHTML = "Save"
    skills_button.onclick = () => save_skills()

}

function plus_point(skill){
    var skills_points = document.querySelector("#skills\\ points-value").textContent
    if (skills_points > 0) {
        var skill_value = document.querySelector(`#${skill}-value`).textContent
        skill_value++
        document.querySelector(`#${skill}-value`).textContent = skill_value
        skills_points--
        document.querySelector("#skills\\ points-value").textContent = skills_points
    }
}

function minus_point(skill, skill_value){
    var skills_points = document.querySelector("#skills\\ points-value").textContent
    var new_skill_value = document.querySelector(`#${skill}-value`).textContent
    if (parseInt(new_skill_value) > parseInt(skill_value)){
        new_skill_value--
        document.querySelector(`#${skill}-value`).textContent = new_skill_value
        skills_points++
        document.querySelector("#skills\\ points-value").textContent = skills_points
    }
}

async function save_skills(){
    var skills_list = ["defence","charms", "transfiguration", "potions", "charisma", "skills\\ points"]
    for (var element of skills_list) {
        var skill_name = element
        var skill_value = document.querySelector(`#${skill_name}-value`).textContent
        console.log(skill_value)
        await fetch('/set_skill', {
            method: "PUT",
            body: JSON.stringify({
                skill_name: skill_name,
                skill_value: skill_value
            })
        })
    }
    location.reload()
    
}

export {update_skill, house_skills, subjects_skills, skills_points}