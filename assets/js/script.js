var cityButton = $("#city-button");
var apiLink = "https://api.openweathermap.org/data/2.5/forecast?lat=-34.928499&lon=138.600746&appid=59fedacb97569041997bcd20b66ef73d&units=metric"



cityButton.on("click", function() {
    var dialog = $(".ui-dialog")
    if (dialog.css("display", "") === dialog.css("display", "none")) {
        dialog.css("display", "block");
    }
})


fetch(apiLink)
.then(function (response) {
  return response.json();
})
.then(function (data) {
  var info = data
  var necessaryInformation = [info.list[1], info.list[9], info.list[17], info.list[25], info.list[33]];
  console.log(necessaryInformation);

  cycleInformation(necessaryInformation);
  determineWeatherImage(necessaryInformation);
});

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
    windTest.text("Wind Speed: " + filterWind + "km/h");
    var tempTest = $("#temp-" + day);
    tempTest.text(RoundedTemp + "°C");
  }
}

function determineWeatherImage(info) {
  var image = "";
  var day = 0;
  for (var i = 0; i < info.length; i++) {
    day = day + 1;
    var weather = info[i].weather[0].main;
    if (weather === "Clouds") {
      image = "./assets/images/cloudy.png";
    } else if (weather === "Rain") {
      image = "./assets/images/raining.png";
    } else if (weather === "Clear") {
      image = "./assets/images/clear.png"
    } else if (weather === "Fog" || "Mist" || "Smoke" || "Haze" || "Dust" || "Sand" || "Ash" || "Squall" || "Tornado") {
      image = "./assets/images/windy.png"
    } else if (weather === "Snow") {
      image = "./assets/images/snow.png"
    } else if (weather === "Thunderstorm") {
      image = "./assets/images/thunderstorm.png"
    }
    var imageHolder = $("#img-" + day);
    imageHolder.attr("src", image);
  }
}

function getDay() {
  var time = dayjs().format("MMMM D, YYYY");
  console.log(time);

  var today = dayjs().format("dddd, DD") + getTh();

  for (var i = 0; i < 5; i++) {
    var tomorrow = dayjs().add(i, 'day').format("dddd, DD");
    var betterFormat = dayjs().add(i, 'day').format("DD");
    var number = parseInt(betterFormat);
    var end = getTh(number);
    var finalDay = tomorrow + end;
    console.log(finalDay);
    var dayCards = $("#day-" + i);
    dayCards.text(finalDay);
  }

  var dayText = $("#today");
  dayText.text(today);

}

getDay();

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