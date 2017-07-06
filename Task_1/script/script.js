// secretkey = d7de79f177f2ba625c20c8e38e6c6d0d
var date1 = document.getElementById("date"),
  ONE_DAY_IN_SECONDS = 86400,
  url = "https://api.darksky.net/forecast/d7de79f177f2ba625c20c8e38e6c6d0d/",
  latitude,
  longitude,
  date,
  newDate,
  newDateMSec;
var container = document.getElementsByClassName("container")[0];

window.onload = function() {
  container.style.visibility = "hidden";
}


// finding the location
function geoFindMe() {
  var output = document.getElementById("out");
  if (!navigator.geolocation) {
    container.style.visibility = "visible";
    output.innerHTML = "<p>Geolocation is not supported by your browser</p>";
    return;
  }

  function success(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    if (!date) {
      setDate();
      todayDate();
    }
    container.style.visibility = "visible";
    url += latitude.toFixed(4) + "," + longitude.toFixed(4) + "," + date;
    newRequest(url);
  };

  function error() {
    container.style.visibility = "visible";
    output.innerHTML = "Unable to retrieve your location";
  };

  navigator.geolocation.getCurrentPosition(success, error);
}
geoFindMe();

// making a request 
function newRequest(url) {
  if (url) {
    $.ajax({
      url: url,
      dataType: 'jsonp'
    }).done(function(data) {
      changeBackground(data);
      getWeather(data);
      getTimeZone(data);
      getTemperature(data);
      getHumidity(data);
      getPressure(data);
      var date = new Date(data.currently.time * 1000);
      date1.innerHTML = date.toDateString();
    })
  }
}

// get the weather in string
function getWeather(data) {
  var curentWeather = document.getElementById('current_weather');
  curentWeather.innerHTML = data.currently.summary + ', ' + data.hourly.summary;
}

// get a time zone
function getTimeZone(data) {
  var timeZone = document.getElementById('time_zone');
  timeZone.innerHTML = data.timezone;
}

// get a temperature
function getTemperature(data) {
  var temperature = document.getElementById("temperature"),
    // temperature in Fahrenheit
    tempF = data.currently.temperature,
    // translate temperature in Fahrenheit to Celsius
    tempC = Math.round(5 / 9 * (tempF - 32));
  temperature.innerHTML = tempC + ' &deg;C';
}

// get a humidity
function getHumidity(data) {
  var humidity = document.getElementById('humidity');
  humidity.innerHTML = '<b>Humidity:</b>  ' + (Math.round((data.currently.humidity) * 100)) + '%';
}

// get a pressure
function getPressure(data) {
  var pressure = document.getElementById('pressure');
  pressure.innerHTML = '<b>Pressure:</b>  ' + (Math.round(data.currently.pressure)) + ' hPa';
}

// change a background and main img, when precipType = "rain" in current time
function changeBackground(data) {
  var weatherImg = document.getElementById("weather_img"),
    rain = data.currently.precipType,
    // rain = data.daily.data[0].precipType,
    body = document.querySelector('body');
  if (rain) {
    body.style.backgroundImage = "url(img/1.gif)";
    weatherImg.src = 'img/14.png'
  } else {
    body.style.backgroundImage = "url(img/12.gif)";
    weatherImg.src = 'img/11.png'
  }
}


// rewrite a url
function defaultAction() {
  url = 'https://api.darksky.net/forecast/d7de79f177f2ba625c20c8e38e6c6d0d/';
  geoFindMe();
}

// bind functions to the button "yesterday"
var yesterdayWeather = document.getElementById("yesterday");
yesterdayWeather.addEventListener("click", function() {
  yesterdayDate();
  defaultAction();
});

// bind functions to the button "today"
var todayWether = document.getElementById("today");
todayWether.addEventListener("click", function() {
  todayDate();
  defaultAction();
});

// bind functions to the button "tomorrow"
var tomorrowWether = document.getElementById("tomorrow");
tomorrowWether.addEventListener("click", function() {
  tomorrowDate();
  defaultAction();
});

// set a date in sec
function setDate() {
  newDate = new Date();
  newDateMSec = Math.round((newDate.getTime()) / 1000);
}

// set yesterday date in sec
function yesterdayDate() {
  setDate();
  date = (newDateMSec - ONE_DAY_IN_SECONDS);
}

// set today date in sec
function todayDate() {
  setDate();
  date = newDateMSec;
}

// set tomorrow date in sec
function tomorrowDate() {
  setDate();
  date = (newDateMSec + ONE_DAY_IN_SECONDS);
}
