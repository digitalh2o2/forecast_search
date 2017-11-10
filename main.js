console.log("hi from console")
// Original search query by user
const userSearch = "http://autocomplete.wunderground.com/aq?query=";

// Various document selectors
const userInput = document.querySelector('.input');
let cityOptions = document.querySelector('#cities');
const cityInfo = document.querySelector('.results');

// Event listener as the user types
userInput.addEventListener('keyup',function(e){
  if(userInput.value.length >= 3){
    getLocation();
  }
})


// Event listener when user 'clicks' on option
cityOptions.addEventListener('click',function(e){
  userInput.value = e.target.textContent;

  console.log(e.target.attributes["0"].value)
  if(userInput.value.length > 3){

  }
  getWeather(e.target.attributes["0"].value);
  cityOptions.innerHTML = ""
})

/////// Functions and Promises //////////

// Search Function As User Types
function getLocation(){
  // Get current value within the input field
  const locationSearch = userInput.value;
  // Fetch the location Promise through the API
  let locationPromise = fetch(userSearch + locationSearch);

  locationPromise
  .then(function(response){
    // Retrieve the response and turn to JSON
    response.json()
    .then(function(response){
      // Store the response in data variable
      const data = response.RESULTS;

      // Clear out the unordered list
      cityOptions.innerHTML = "";

      // Iterate through each result in the data
      data.forEach(function(item){
        console.log(item)
        // create new elements that will store the information
        let link = document.createElement('a');
        let details = document.createElement('li');
        // Set attribute and name of individual list item in order to get final information
        details.setAttribute("zmw", item.zmw);
        details.innerHTML = item.name;
        // Append the details to the anchor and then finally to the unordered list
        link.appendChild(details);
        cityOptions.appendChild(link);
      })
    })
    // Otherwise toss error if there is one
    .catch(function(err){
      console.log(err)
    })
  });
}

function getWeather(city){
  // grab promise from api after user clicks on their search results.
  let cityPromise = fetch("http://api.wunderground.com/api/8035f0a54e790f36/conditions/q/zmw:" + city + ".json");

  cityPromise
  .then(function(response){
    response.json()
    .then(function(response){
      // store response in cityData variable
      let cityData = response.current_observation;
      // we grab the current time and extract the hours
      let hr = cityData.local_time_rfc822.split(" ")[4].split(":")[0];

      let weatherIcon = cityData.icon
      console.log(cityData);

      // switch statement to verify current conditions and use custom images to display to user.
      switch(weatherIcon){
        case 'cloudy':
          weatherIcon = './images/cloudy.png';
          break;
        case 'clear':
          // if statement to see whether it is daytime or night time in users search.
          if(hr > 6 && hr <= 19){
            weatherIcon = "./images/sunnyclear.png"
          } else {
            weatherIcon = './images/clear.png'
          }
          break;
      }
      cityInfo.innerHTML = `
        <div class="container cityInfo">
          <h1 class="subtitle">${cityData.display_location.full}</h1>

          <img src="${weatherIcon}" alt="${cityData.icon}">
          <h3>${cityData.icon}</h3>

          <h3>Current Temperature ${cityData.temperature_string}</h3>
          <h3>Feels like: ${cityData.feelslike_string}</h3>
        </div>
      `
      console.log(cityData);
    })
    .catch(function(err){
      console.log(err)
    });
  })
}
