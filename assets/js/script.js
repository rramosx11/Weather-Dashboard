var fiveDay = document.querySelector("#five-day");

var formSubmitHandler = function (event) {
  // stop page from refreshing
  event.preventDefault();

  // get value from input

  var cityName = $("#cityname").val().trim();
  if (cityName) {
    getWeather(cityName);
  }
};

var getWeather = function (city) {
  // format the weather api url
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    city +
    "&appid=bda95baec6bc5b56e1a5b8d7e5c95181";
  // make a get request to url

  fetch(apiUrl)
    .then(function (response) {
      // request was successful
      if (response.ok) {
        console.log(response);
        response.json().then(function (data) {
          console.log(data);
          displayWeather(data, city);
        });
      } else {
        alert("Error: Open Weather User Not Found");
      }
    })
    .catch(function (error) {
      alert("Unable to connect to Open Weather");
    });
};

var displayWeather = function () {};

$("#search-form").submit(formSubmitHandler);
