document.addEventListener("DOMContentLoaded", function(){
  updatePage()
  getFilterButton().addEventListener("click", toggleGoodDogFilter)
});

function toggleGoodDogFilter(){
  getFilterButton().innerHTML === "Filter good dogs: OFF" ?
    getFilterButton().innerHTML = "Filter good dogs: ON" :
    getFilterButton().innerHTML = "Filter good dogs: OFF"
  updatePage()
}

function getFilterButton(){
  return document.querySelector('#good-dog-filter')
}

function updatePage(){
  clearDogBar()
  if(getFilterButton().innerHTML === "Filter good dogs: ON"){
    fetchAllPuppers().then(data => {
      data.filter((pupper) => pupper.isGoodDog === true).forEach(pupper => renderPupper(pupper))
    })
  }else{
    fetchAllPuppers().then(data => {
      data.forEach(pupper => renderPupper(pupper))
    })
  }
}

function clearDogBar(){
  getDogBar().innerHTML = ''
}

function fetchAllPuppers(){
  return fetch(`http://localhost:3000/pups`)
  .then(response => response.json())
  .then(jsonData => {
    return jsonData
  })
}

function fetchUpdate(id, newStatus){
  console.log(id, newStatus)
  fetch(`http://localhost:3000/pups/${id}`, {
    "method": "PATCH",
    "headers" : {
      "Content-Type": "application/json"
    },
    "body" : JSON.stringify({"isGoodDog" : newStatus})
  }).then(() => updatePage())
}

function updateGoodBoy(event){
  let isGoodDog = event.target.innerHTML === "Good Dog!" ? true : false
  if(isGoodDog){
    event.target.innerHTML = "Bad Dog!"
  }else{
    event.target.innerHTML = "Good Dog!"
  }
  fetchUpdate(event.target.dataset.id, !isGoodDog)
}

function showMoreDetails(event){
  getDogInfoContainer().innerHTML =
    `<img src=${event.target.dataset.image}>
   <h2>${event.target.innerHTML}</h2>
   <button>${event.target.dataset.good == "true" ? "Good Dog!" : "Bad Dog!"}</button>`

   getDogInfoContainer().querySelector('button').dataset.id = event.target.dataset.id
   getDogInfoContainer().querySelector('button').addEventListener("click", updateGoodBoy)
}

function renderPupper(pupper){
  let span = document.createElement('span')
  span.innerHTML = `${pupper.name}`
  span.dataset.good = pupper.isGoodDog
  span.dataset.image = pupper.image
  span.dataset.id = pupper.id
  span.addEventListener("click", showMoreDetails)
  getDogBar().appendChild(span)
}

function getDogBar(){
  return document.querySelector('#dog-bar')
}

function getDogInfoContainer(){
  return document.querySelector('#dog-info')
}
