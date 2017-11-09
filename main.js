console.log("hi from console")
const userSearch = "http://autocomplete.wunderground.com/aq?query=";
const userInput = document.querySelector('.input');
let cityOptions = document.querySelector('#cities');


userInput.addEventListener('keyup',function(e){
  if(userInput.value.length >= 3){
    getLocation();
  }
})

// Search Function As User Types
function getLocation(){
  const locationSearch = userInput.value;

  const location = fetch(userSearch + locationSearch);

  location
    .then(function(response){
      response.json()
      .then(function(response){
        const data = response.RESULTS;
        cityOptions.innerHTML = "";

        data.forEach(function(item){
          console.log(item.name)
          let option = document.createElement('option');
          option.value = item.name;
          cityOptions.appendChild(option);
        })
      })
      .catch(function(err){
        console.log(err)
      })
    });
}
