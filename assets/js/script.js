var cityButton = $("#city-button");
var apiLink = "api.openweathermap.org/data/2.5/forecast?lat=-34.928499&lon=138.600746&appid=59fedacb97569041997bcd20b66ef73d"



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
  console.log(data)
});