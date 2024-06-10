const geoCodeAPIKey = "156020926653841130072x3542"; // Your Geocode API key
const btnEl = document.querySelector(".btn");
const weatherAPIKey = "ZHCCS3FCW7P9MPMHHGGPL4V8J"; // Your Visual Crossing Weather API key
const cityInput = document.querySelector(".city-input");
const futureWeatherList = document.querySelector(".future-weather-list");

const getPosition = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const getCityFromCoords = function (lat, lng) {
  const geoCodeUrl = `https://geocode.xyz/${lat},${lng}?geoit=json&auth=${geoCodeAPIKey}`;
  return fetch(geoCodeUrl);
};

const displayWeather = function (data) {
  const weatherDetails = document.querySelector(".text-area");
  const daysHtml = data.days
    .map((day) => {
      return `
      <div class="weather-day">
        <h4>${day.datetime}</h4>
        <p>Avg Temp: ${day.temp.toFixed(1)} °C</p>
        <p>Conditions: ${day.conditions}</p>
      </div>


    `;
    })
    .join("");

  weatherDetails.innerHTML = `
  <div class="weather-detail" id="temperature">
    <h4>Temperature <br /><span>${data.currentConditions.temp.toFixed(
      1
    )}</span></h4>
  </div>
  <div class="weather-detail" id="humidity">
    <h4>Humidity <br /><span>${data.currentConditions.humidity} %</span></h4>
  </div>
  <div class="weather-detail" id="description">
    <h4>Description <br /><span>${data.currentConditions.conditions}</span></h4>
  </div>  
  <div class="weather-detail" id="city">
      <h4>In <span>${data.resolvedAddress}</span></h4>
  </div> 
        `;

  futureWeatherList.innerHTML = daysHtml;

  cityInput.value = cityInput.value ? "" : data.resolvedAddress.split(", ")[0];
};

const getWeatherByCoords = function () {
  getPosition()
    .then((pos) => {
      const { latitude: lat, longitude: lng } = pos.coords;
      return getCityFromCoords(lat, lng);
    })
    .then((res) => {
      if (!res.ok) throw new Error(`Geocode API error: ${res.statusText}`);
      return res.json();
    })
    .then((data) => {
      const city = data.city;
      getWeatherByCity(city);
    })
    .catch((err) => {
      console.error(`Something went wrong: ${err.message}`);
      alert(`Failed to fetch weather data. Please try again.`);
    });
};

const getWeatherByCity = function (city) {
  const weatherUrlByCity = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${weatherAPIKey}`;
  fetch(weatherUrlByCity)
    .then((res) => {
      if (!res.ok) throw new Error(`Weather API error: ${res.statusText}`);
      return res.json();
    })
    .then((data) => {
      displayWeather(data);
      console.log(data);
    });
};

btnEl.addEventListener("click", getWeatherByCoords);
cityInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    getWeatherByCity(cityInput.value);
  }
});
