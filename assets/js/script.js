var cityButton = $("#city-button");
var apiLink = "https://api.openweathermap.org/data/2.5/forecast?q=";
var details = "&appid=59fedacb97569041997bcd20b66ef73d&units=metric";
var citySearchButton = $("#city-search-button");
var citySearchBar = $("#city-search-bar");
var widgetButton = $(".ui-button");
var availableCities = [
  "Hobart",
  "Brisbane",
  "Adelaide",
  "Canberra",
  "Darwin",
  "Perth",
  "Melbourne",
  "Sydney"
];

cityButton.on("click", function() {
    var dialog = $(".ui-dialog");
    if (dialog.css("display", "") === dialog.css("display", "none")) {
        dialog.css("display", "block");
  }
})

function cityLogic(city) {
  var name = city;
  assignCityName(name);
  var newLink = apiLink + name + details;
  console.log(newLink)
  return newLink;
}

function assignCityName(city) {
  var cityNameText = $("#city-name");
  var date = dayjs().format("DD/MM/YYYY");
  var span = $("<span></span");
  span.text(" (" + date + ")");
  cityNameText.text(city);
  cityNameText.append(span);
}

$( function() {
  citySearchBar.autocomplete({
    source: availableCities
  });
});

citySearchButton.on("click", function() {
  var value = citySearchBar.val();
  for (var i = 0; i < availableCities.length; i++) {
      fetchStuff(value);
      window.localStorage.setItem("previousCity", value);
      setCitySaves(value);
      setPlaceholder();
  }
})

$("#city-form").on("submit", function(event) {
  event.preventDefault();
  var value = citySearchBar.val();
  for (var i = 0; i < availableCities.length; i++) {
      fetchStuff(value);
      window.localStorage.setItem("previousCity", value);
      setCitySaves(value);
      setPlaceholder();
  }
})

function setPlaceholder() {
  var previousInput = window.localStorage.getItem("previousCity");
  var bar = $("#city-search-bar");
  bar.attr("placeholder", previousInput);
  bar.val("");
}

function setCitySaves(item) {
  const cityArray = JSON.parse(window.localStorage.getItem('SavedCityArray')) || [];
  if (cityArray) {
    if (cityArray.includes(item)) {
      return
      } else {
      cityArray.push(item);
      window.localStorage.setItem('SavedCityArray', JSON.stringify(cityArray));
      createButtonBars(false, item);
    }
  }
};

function createButtonBars(create, value) {
  const divHolder = $("#button-holder");
  if (create) {
    const cityArray = JSON.parse(window.localStorage.getItem('SavedCityArray')) || [];
    for (let i = 0; i < cityArray.length; i++) {
      let button = $("<button>");
      button.addClass("city-display-button mt-1");
      button.attr("data-city", cityArray[i]);
      button.text(cityArray[i]);
      divHolder.append(button);
    }
  } else {
    if (divHolder.children().length >= 8) {
      var buttonToRemove = divHolder.children().first();
      removeSave(buttonToRemove.text())
      buttonToRemove.remove();
      let button = $("<button>");
      button.addClass("city-display-button mt-1");
      button.attr("data-city", value);
      button.text(value);
      divHolder.append(button);
    } else {
      let button = $("<button>");
      button.addClass("city-display-button mt-1");
      button.attr("data-city", value);
      button.text(value);
      divHolder.append(button);
    }
  }
}

function removeSave(name) {
  var array = JSON.parse(window.localStorage.getItem("SavedCityArray"));
  if (array.includes(name)) {
    var firstEl = array[0];
    array.splice(firstEl, 1);
    window.localStorage.setItem("SavedCityArray", JSON.stringify(array));
  }
}

$("#button-holder").on("click", function(event) {
  var target = event.target;
  var value = target.getAttribute("data-city");
  window.localStorage.setItem("previousCity", value);
  setPlaceholder();
  fetchStuff(value);
})

function fetchStuff(input) {
  fetch(cityLogic(input))
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    var info = data
    var necessaryInformation = [info.list[1], info.list[9], info.list[17], info.list[25], info.list[33]];
  
    setMainInfo(necessaryInformation);
    cycleInformation(necessaryInformation);
    determineWeatherImage(necessaryInformation);
    getDay();
  });
}

function cycleInformation(stuff) {
  var day = 0;
  for (var i = 0; i < stuff.length; i++) {
    day = day + 1
    var filterHumidity = stuff[i].main.humidity;
    var filterWind = stuff[i].wind.speed;
    var filterTemp = stuff[i].main.temp;
    var RoundedTemp = filterTemp.toFixed(1);
    var humidityTest = $("#humidity-" + day);
    humidityTest.text("Humidity: " + filterHumidity +"%");
    var windTest = $("#wind-" + day);
    windTest.text("Wind: " + filterWind + "km/h");
    var tempTest = $("#temp-" + day);
    tempTest.text(RoundedTemp + "°C");
  }
}

function setMainInfo(stuff) {
    var filterHumidity = stuff[0].main.humidity;
    var filterWind = stuff[0].wind.speed;
    var filterTemp = stuff[0].main.temp;
    var RoundedTemp = filterTemp.toFixed(1);
    var humidityCity = $("#city-humidity");
    humidityCity.text("Humidity: " + filterHumidity +"%");
    var windCity = $("#city-wind");
    windCity.text("Wind: " + filterWind + "km/h");
    var tempCity = $("#city-temp");
    tempCity.text("Temperature: " + RoundedTemp + "°C");
}

function determineWeatherImage(info) {
  var image = "";
  var backgroundImage = "";
  var day = 0;
  for (var i = 0; i < info.length; i++) {
    day = day + 1;
    var weather = info[i].weather[0].main;
    if (weather === "Clouds") {
      image = "./assets/images/icons/cloudy.png";
      backgroundImage = "https://i.pinimg.com/736x/be/69/80/be6980f240fc6a14730e8f85aea07f32.jpg";
    } else if (weather === "Rain") {
      image = "./assets/images/icons/raining.png";
      backgroundImage = "./assets/images/background/Rain.png";
    } else if (weather === "Clear") {
      image = "./assets/images/icons/clear.png";
      backgroundImage = "https://img.freepik.com/fotos-premium/cielo-ensueno-como-fondo-abstracto-fantasia-colores-pastel-belleza-diseno-naturaleza_360074-8272.jpg"
    } else if (weather === "Fog" || "Mist" || "Smoke" || "Haze" || "Dust" || "Sand" || "Ash" || "Squall" || "Tornado") {
      image = "./assets/images/icons/windy.png";
    } else if (weather === "Snow") {
      image = "./assets/images/icons/snow.png";
      backgroundImage = "https://static.vecteezy.com/system/resources/previews/007/188/223/original/abstract-blue-winter-watercolor-background-sky-pattern-with-snow-vector.jpg";
    } else if (weather === "Thunderstorm") {
      image = "./assets/images/icons/thunderstorm.png";
      backgroundImage = "./assets/images/background/Rain.png";
    }
    var imageHolder = $("#img-" + day);
    imageHolder.attr("src", image);
    var cardDiv = $("#forecast-card-" + day)
    cardDiv.css("background-image", "url(" + backgroundImage + ")");
  }
}

function getDay() {
  var today = dayjs().format("dddd");
  for (var i = 0; i < 5; i++) {
    var tomorrow = dayjs().add(i, 'day').format("dddd");
    var betterFormat = dayjs().add(i, 'day').format("DD");
    var number = parseInt(betterFormat);
    var end = getTh(number);
    var finalDay = tomorrow + ", " + number + end;
    var dayCards = $("#day-" + i);
    dayCards.text(finalDay);
  }
  var dayText = $("#today");
  var day = parseInt(dayjs().format("DD"));
  dayText.text(today + ", " + day + getTh(day));
}
  
function getTh(day) {
    if (day === 1 || day === 21 || day === 31) {
    var th = "st";
  } else if (day === 2 || day === 22) {
    var th = "nd";
  } else if (day === 3 || day === 23) {
    var th = "rd";
  } else
  {
    var th = "th";
  } return th;
}

createButtonBars(true);
fetchStuff(window.localStorage.getItem('previousCity') || "Adelaide");