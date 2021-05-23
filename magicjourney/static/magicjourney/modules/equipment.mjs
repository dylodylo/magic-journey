async function buy_item(button){
    var item_id = button.getAttribute('data-id')
    var model = button.getAttribute('data-model')
    await fetch('/buy_item', {
        method: "PUT",
        body: JSON.stringify({
            item_id: item_id,
            model_name: model
        })
    })
    .then(response => response.json())
    .then(data => {
        var status = data.status
        var message = data.message
        if (status)
        {
            var money = data.money
            var story = data.story
            document.querySelector("#money").innerHTML = money
            //narrator.innerHTML = story
            alert(message)
        }
        
        else {
            alert(message)
        }
    })
}

async function equip(button)
{
    var itemId = button.getAttribute("data-item")
    var category = button.getAttribute("data-category")
    await fetch('/change_equipment', {
        method: "PUT",
        body: JSON.stringify({
            category: category,
            item: itemId
        })
    })
    .then(response => response.json())
    .then((data) => {
        var item = data.item
        document.querySelector(`#players-${category.toLowerCase()}`).innerHTML = item
    })
    location.reload()
}

async function unequip(button)
{
    var item = button.getAttribute("data-item")
    await fetch('/unequip', {
        method: "PUT",
        body: JSON.stringify({
            item: item
        })
    })
    .then(response => response.json())
    location.reload()
}


export {buy_item, equip, unequip}