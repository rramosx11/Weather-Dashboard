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
    "&appid=bda95baec6bc5b56e1a5b8d7e5c95181&units=imperial";
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

var displayWeather = function (weatherData) {
  // format and display the values
  $("#main-city-name")
    .text(
      weatherData.name +
        " (" +
        dayjs(weatherData.dt * 1000).format("MM/DD/YYYY") +
        ") "
    )
    .append(
      `<img src="https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png"></img>`
    );
  // weatherData.name + " " + moment().format("(MMMM/DD/YYYY)"));
  $("#main-city-temp").text("Temperature: " + weatherData.main.temp + " °F");
  $("#main-city-wind").text("Wind Speed: " + weatherData.wind.speed + " MPH");
  $("#main-city-humid").text("Humidity: " + weatherData.main.humidity + " %");

  // use lat and lon to make uvi call
  fetch(
    "https://api.openweathermap.org/data/2.5/uvi?lat=" +
      weatherData.coord.lat +
      "&lon=" +
      weatherData.coord.lon +
      "&appid=bda95baec6bc5b56e1a5b8d7e5c95181"
  ).then(function (response) {
    response.ok;

    response.json().then(function (data) {
      $("#uv-box").text(data.value);
      //   $("#main-city-uv").text("UV Index: " + data.value);
      // highlight the value using the EPA's UV Index Scale colors
      if (data.value >= 11) {
        $("#uv-box").css("background-color", "#6c49cb");
      } else if (data.value < 11 && data.value >= 8) {
        $("#uv-box").css("background-color", "#d90011");
      } else if (data.value < 8 && data.value >= 6) {
        $("#uv-box").css("background-color", "#f95901");
      } else if (data.value < 6 && data.value >= 3) {
        $("#uv-box").css("background-color", "#f7e401");
      } else {
        $("#uv-box").css("background-color", "#299501");
      }
    });
  });
  fetch(
    "https://api.openweathermap.org/data/2.5/forecast?q=" +
      weatherData.name +
      "&appid=bda95baec6bc5b56e1a5b8d7e5c95181&units=imperial"
  ).then(function (response) {
    console.log(response);
    response.json().then(function (data) {
      console.log(data);
      // clear any previous entries in the five-day forecast
      $("#five-day").empty();

      // get every 8th value (24hours) in the returned array from the api call
      for (i = 7; i <= data.list.length; i += 8) {
        // insert data into my day forecast card template
        var fiveDayCard =
          "<div class='col-md-2 m-2 py-3 card text-white bg-primary'><div class='card-body p-1'><h5 class='card-title'>" +
          dayjs(data.list[i].dt * 1000).format("MMMM/DD/YYYY") +
          "</h5> <img src = 'https://openweathermap.org/img/wn/" +
          data.list[i].weather[0].icon +
          ".png' alt =''><p class='card-text'>Temperature: " +
          data.list[i].main.temp +
          "</p><p class='card-text'>Wind: " +
          data.list[i].wind.speed +
          "</p><p class='card-text'>Humidity: " +
          data.list[i].main.humidity +
          "</p></div></div>";
        // append to five day forecast
        $("#five-day").append(fiveDayCard);
      }
    });
  });
};

$("#search-form").submit(formSubmitHandler);
