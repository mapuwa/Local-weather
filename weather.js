function getJSON(url){
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", url, false);
    xhttp.send();
    return JSON.parse(xhttp.responseText);
}

function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: ""
            };
            var response = getJSON("http://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng);
            if (response.status == "OK") {
                pos.address = response.results[0].formatted_address;
            }
            showWeather(pos);
        }, function() {
            findByIP();
        });
    } else {
        findByIP();
    }
}

function  findByIP() {
    var response = getJSON("http://ip-api.com/json");
    var pos = {
        lat: response.lat,
        lng: response.lon,
        address: response.city + ", " + response.country
    };
    showWeather(pos);
}
/* Temperature equation
Celsius = Kelvin - 273,15
Fahrenhet = Kelvin × 1.8 - 459.67
 */
function showWeather(pos) {
    var appid = "bd7405d0ac546bd7c95056e861356b2b";
    var res = getJSON("http://api.openweathermap.org/data/2.5/weather?lat=" + pos.lat + "&lon=" + pos.lng +"&APPID=" + appid);

    console.log(res);
    document.getElementById("temperatur").innerHTML = res.main.temp + " K";
    document.getElementById("pressure").innerHTML = res.main.pressure + " hPa";
    document.getElementById("humidity").innerHTML = res.main.humidity + "%";
    document.getElementById("description").innerHTML = res.weather[0].description;

    switch(res.weather[0].icon) {
        case "01d":
            document.getElementById("weather-icon").classList.add("wi-day-sunny");
            break;
        case "02d":
            document.getElementById("weather-icon").classList.add("wi-day-cloudy");
            break;
        case "03d":
            document.getElementById("weather-icon").classList.add("wi-cloud");
            break;
        case "04d":
            document.getElementById("weather-icon").classList.add("wi-cloudy");
            break;
        case "09d":
            document.getElementById("weather-icon").classList.add("wi-showers");
            break;
        case "10d":
            document.getElementById("weather-icon").classList.add("wi-showers");
            break;
        case "11d":
            document.getElementById("weather-icon").classList.add("wi-thunderstorm");
            break;
        case "13d":
            document.getElementById("weather-icon").classList.add("wi-snow");
            break;
        case "50d":
            document.getElementById("weather-icon").classList.add("wi-day-fog");
            break;
        case "01n":
            document.getElementById("weather-icon").classList.add("wi-night-clear");
            break;
        case "02n":
            document.getElementById("weather-icon").classList.add("wi-night-alt-cloudy");
            break;
        case "03n":
            document.getElementById("weather-icon").classList.add("wi-cloud");
            break;
        case "04n":
            document.getElementById("weather-icon").classList.add("wi-cloudy");
            break;
        case "09n":
            document.getElementById("weather-icon").classList.add("wi-showers");
            break;
        case "10n":
            document.getElementById("weather-icon").classList.add("wi-rain");
            break;
        case "11n":
            document.getElementById("weather-icon").classList.add("wi-thunderstorm");
            break;
        case "13n":
            document.getElementById("weather-icon").classList.add("wi-snow");
            break;
        case "50n":
            document.getElementById("weather-icon").classList.add("wi-fog");
            break;
    }

}

findLocation();