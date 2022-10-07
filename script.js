const APIURL = "https://api.openweathermap.org/data/2.5/weather?q=";
const APIKEY = "&APPID=e6bd975e2025c7f3f95e8b604dacd30a";
const IMGAPI = "https://api.teleport.org/api/urban_areas/slug:";

const mainContent = document.querySelector(".weather-container");
const form = document.querySelector(".weather-form");
const search = document.getElementById("search");

async function getWeatherByLocation(location) {
  const resp = await fetch(APIURL + location + APIKEY);
  const respData = await resp.json();
  const name = displayCity(respData);

  const img = await fetch(IMGAPI + location.replaceAll(" ", "-").toLowerCase() + "/images/");
  const imgData = await img.json();
  if (imgData.status === 404) {
    addBackground(undefined);
  } else {
    addBackground(imgData);
  }
}

function displayCity(data) {
  const today = new Date();
  const cityTime = new Date(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), today.getUTCHours(), today.getUTCMinutes() + Math.floor(data.timezone / 60), today.getUTCSeconds());
  let cityInfo = "";
  if (data.cod === 200) {
    cityInfo = `
  <div class="info">
    <h4 class="name">${data.name}</h4>
    <div class="temperature">
      <p class="fill-space"></p>
      <p class="temp-value">${KToC(data.main.temp)}</p>
      <p class="temp-units">°C</p>
    </div>
    <img class="weather-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">
    <p class="weather-type">${data.weather[0].main}</p>
    <p class="time">${formatTime(cityTime.getHours())}:${formatTime(cityTime.getMinutes())}</p>
    <p class="wind">Wind: ${data.wind.speed}m/s</p>
    <div class="recommendation">
      <p class="recommendation-title">Dino's recommendation:</p>
      <p>${KToC(data.main.temp) > 25 ? "Be fresh" : "Wear sweater"}</p>
      <img class="dino" src=${KToC(data.main.temp) > 25 ? "https://github.com/IvanMendoza1616/weather-app/blob/main/hot.jpg" : "https://github.com/IvanMendoza1616/weather-app/blob/main/cold.jpg"}>
    </div>
  </div>
  `;
  } else if (data.cod === "404") {
    cityInfo = `<h1 class="not-found">City not found</h1>`;
  }
  mainContent.innerHTML = cityInfo;
  return data.name;
}

function addBackground(data) {
  const background = document.querySelector(".container");
  if (data) {
    background.style.backgroundImage = `url("${data.photos[0].image.mobile}")`;
  } else {
    background.style.backgroundImage = `url("https://images.unsplash.com/photo-1496450681664-3df85efbd29f?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fHdlYXRoZXJ8ZW58MHx8MHx8&w=1000&q=80")`;
  }
}

function KToC(K) {
  return Math.round(K - 273.15);
}

getWeatherByLocation("london");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = search.value;
  search.value = "";
  if (searchTerm) {
    getWeatherByLocation(searchTerm);
  }
});

function formatTime(time) {
  if (time < 10) {
    return "0" + time;
  }
  return time;
}
