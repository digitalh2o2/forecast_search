console.log("Hi from console");
// Original search query by user
const userSearch = "http://autocomplete.wunderground.com/aq?query=";

// Cors proxy header for initial search
const proxyURL = "https://cors-anywhere.herokuapp.com/";

// Various document selectors
const userInput = document.querySelector(".input");
const cityOptions = document.querySelector("#cities");
const cityInfo = document.querySelector(".results");

// Event listener as the user types
userInput.addEventListener("keyup", function(e) {
  if (userInput.value.length >= 3) {
    getLocation();
  }
});

// Event listener when user 'clicks' on option
cityOptions.addEventListener("click", function(e) {
  userInput.value = e.target.textContent;
  getWeather(e.target.attributes["0"].value);
  cityOptions.innerHTML = "";
});

/////// Functions and Promises //////////

// Search Function As User Types
function getLocation() {
  // Get current value within the input field
  const locationSearch = userInput.value;
  const userURl = userSearch + locationSearch;
  // Fetch the location Promise through the API
  let locationPromise = fetch(proxyURL + userURl);

  locationPromise.then(function(response) {
    // Retrieve the response and turn to JSON
    response
      .json()
      .then(function(response) {
        // Store the response in data variable
        const data = response.RESULTS;

        // Clear out the unordered list
        cityOptions.innerHTML = "";

        // Iterate through each result in the data
        data.forEach(function(item) {
          console.log(item);
          // create new elements that will store the information
          let link = document.createElement("a");
          let details = document.createElement("li");
          // Set attribute and name of individual list item in order to get final information
          details.setAttribute("zmw", item.zmw);
          details.innerHTML = item.name;
          // Append the details to the anchor and then finally to the unordered list
          link.appendChild(details);
          cityOptions.appendChild(link);
        });
      })
      // Otherwise toss error if there is one
      .catch(function(err) {
        console.log(err);
      });
  });
}

function getWeather(city) {
  // grab promise from api after user clicks on their search results.
  let cityPromise = fetch(
    "https://api.wunderground.com/api/8035f0a54e790f36/conditions/q/zmw:" +
      city +
      ".json"
  );

  cityPromise.then(function(response) {
    response
      .json()
      .then(function(response) {
        // store response in cityData variable
        let cityData = response.current_observation;
        // we grab the current time and extract the hours
        let hr = cityData.local_time_rfc822.split(" ")[4].split(":")[0];
        let dayTime = hr > 6 && hr <= 19;
        // store the description for current weather to use within object
        let weatherIcon = cityData.icon;
        // switch statement to verify current conditions and use custom images to display to user.
        const wind = cityData.wind_dir.toLowerCase();

        const getIcon = {
          cloudy: "./images/cloudy.png",
          partlycloudy: dayTime
            ? "./images/daypartlycloudy.png"
            : "./images/nightpartlycloudy.png",
          mostlycloudy: dayTime
            ? "./images/daypartlycloudy.png"
            : "./images/nightpartlycloudy.png",
          clear: dayTime ? "./images/sunnyclear.png" : "./images/clear.png",
          sunny: "./images/sunnyclear.png",
          mostlysunny: "./images/sunnyclear.png",
          partlysunny: "./images/daypartlycloudy.png",
          sleet: "./images/sleet.png",
          rain: "./images/rainy.png",
          snow: "./images/snow.png",
          tstorms: "./images/storms.png",
          unknown: "./images/unknown.png",
          flurries: "./images/flurries.png",
          fog: "./images/fog.png",
          hazy: "./images/fog.png"
        };

        cityInfo.innerHTML = `
        <div class="container cityInfo is-mobile">
          <h1 class="subtitle">${cityData.display_location.full}</h1>

          <img src="${getIcon[weatherIcon]}" alt="${cityData.icon}">
          <h3>${cityData.weather}</h3>

          <h3>Current Temperature: ${cityData.temperature_string}</h3>
          <h3>Feels like: ${cityData.feelslike_string}</h3>
          <h3>Wind Direction From ${cityData.wind_dir}</h3>
          <i class="wi wi-wind wi-from-${wind}"></i>
        </div>
      `;
      })
      .catch(function(err) {
        console.log(err);
      });
  });
}
