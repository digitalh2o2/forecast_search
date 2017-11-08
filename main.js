console.log("hi from console")
const userSearch = "http://autocomplete.wunderground.com/aq?query=";
const userInput = document.querySelector('.input');

userInput.addEventListener('keyup',function(e){
  getLocation();
})

// Search Function
function getLocation(){
  const locationSearch = userInput.value;

  const location = fetch(userSearch + locationSearch);

  location
    .then(function(response){
      response.json()
      .then(function(response){
        console.log(response)
      })
      .catch(function(err){
        console.log(err)
      })
    });
}
