console.log("hi from console")
// original search query by user
const userSearch = "http://autocomplete.wunderground.com/aq?query=";

// various document selectors
const userInput = document.querySelector('.input');
//const cityName = document.querySelector('datalist');
let cityOptions = document.querySelector('#cities');


userInput.addEventListener('keyup',function(e){
  if(userInput.value.length >= 3){
    getLocation();
  }
})

cityOptions.addEventListener('click',function(e){
  userInput.value = e.target.textContent;
  console.log(e.target.attributes["0"].value);
  cityOptions.innerHTML = ""
})

// Search Function As User Types
function getLocation(){
  // Get current value within the input field
  const locationSearch = userInput.value;
  // Fetch the location Promise through the API
  const locationPromise = fetch(userSearch + locationSearch);

  locationPromise
  .then(function(response){
    // retrieve the response and turn to JSON
    response.json()
    .then(function(response){
      // store the response in data variable
      const data = response.RESULTS;

      // clear out the unordered list
      cityOptions.innerHTML = "";

      // iterate through each result in the data
      data.forEach(function(item){
        console.log(item)
        // create new elements that will store the information
        let link = document.createElement('a');
        let details = document.createElement('li');
        // set attribute and name of individual list item in order to get final information
        details.setAttribute("zmw", item.zmw);
        details.innerHTML = item.name;
        // append the details to the anchor and then finally to the unordered list
        link.appendChild(details);
        cityOptions.appendChild(link);
      })
    })
    // otherwise toss error if there is one
    .catch(function(err){
      console.log(err)
    })
  });
}
