document.addEventListener("DOMContentLoaded", () => {
    renderAllDogs()
    handleFilterButton()
})

function handleFilterButton() {
    document.getElementById("good-dog-filter").onclick = function(e) {
        showOnlyGoodDogs(e.target)
    }
}

function showOnlyGoodDogs(button) {
    console.log("showing just the good ones!")
    if (button.dataset.filter==="false") {
        button.innerText = "Filter good dogs: ON"
        button.dataset.filter = "true"
        renderGoodDogs()
    } else {
        button.innerText = "Filter good dogs: OFF"
        button.dataset.filter = "false"
        renderAllDogs()
    }
    
}

function renderGoodDogs() {
    document.getElementById("dog-bar").innerHTML = ""
    fetch("http://localhost:3000/pups")
    .then(dogs => dogs.json())
    .then(dogs => dogs.filter(function(dog) {
        return dog.isGoodDog
    }))
    .then(dogs => createAndAppendDogs(dogs))
}

function renderAllDogs() {
    document.getElementById("dog-bar").innerHTML = ""
    fetch("http://localhost:3000/pups")
    .then(dogs => dogs.json())
    .then(dogs => createAndAppendDogs(dogs))
}

function createAndAppendDogs(dogs) {
    dogs.forEach(dog => {
        createDogForDogBar(dog)
    })
}

function createDogForDogBar(dogObj) {
    let dogEl = document.createElement("span")
    dogEl.innerHTML = dogObj.name
    //might need to add dog-id to the element too, might not
    //dogEl.dataset.id = dogObj.id
    dogEl.onclick = function(e) {
        showDog(dogObj.id)
    }
    document.getElementById("dog-bar").appendChild(dogEl)
}

function showDog(dogId) {
    fetch(`http://localhost:3000/pups/${dogId}`)
    .then(resp => resp.json())
    .then(dog => {
        createDogSummaryHTML(dog)
    })
}

function createDogSummaryHTML(dogObj) {
    let dogButtonText = dogObj.isGoodDog ? "Good Dog!" : "Bad Dog!"
    let dogSummaryHTML = `<img src="${dogObj.image}" />
    <h2>${dogObj.name}</h2>
    <br>
    <button id="goodness-button" data-id="${dogObj.id}">${dogButtonText}</button>`
    document.getElementById("dog-info").innerHTML = dogSummaryHTML
    document.querySelector("#goodness-button").onclick = function(e) {
        toggleDogGoodness(e.target)
    }
}

function toggleDogGoodness(button) {
    let newGoodness = button.innerText === "Bad Dog!" ? true : false
    fetch(`http://localhost:3000/pups/${button.dataset.id}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify({isGoodDog: newGoodness})
    })
    .then(console.log(newGoodness))
    .then(button.innerText = newGoodness ? "Good Dog!" : "Bad Dog!")
}

