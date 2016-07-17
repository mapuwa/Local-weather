/**
 * Send GET request on the url a call function with parsed JSON or with error
 * @param url url with JSON
 * @param cl function, which is called with parsed JSON
 * @param err function, which is called, when error occurs.
 */
function getJSON(url, cl, err){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function (oEvent) {
        if (xhttp.readyState === 4) {
            if (xhttp.status === 200)
                cl(JSON.parse(xhttp.responseText));
            else
                err("Error", xhttp.statusText);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

/**
 * Convert temperature in Kelvin to Celsius and round on 2 digits
 * @param k temperature in Kelvin
 * @returns {number} temperature in Celsius
 */
function kelvinToCelsius(k) {
    return (k - 273.15).toFixed(2);
}

/**
 * Convert temperature in Kelvin to Fahrenheit and round on 2 digits
 * @param k temperature in Kelvin
 * @returns {number} temperature in Fahrenheit
 */
function kelvinToFahr(k) {
    return (k * 1.8 - 459.67).toFixed(2);
}

/**
 * Find location with usage HTML5 Geolocation or with usage external IP location service. If is location found, call cl,
 * otherwise err function.
 * @param cl function, which is called in case of success with parameter position
 * @param err function, which is called in case of error
 */
function findLocation(cl, err) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var url = "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude;
            var fc = function (res) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                    address: typeof res === 'object' && res.status == "OK" ? res.results[0].formatted_address : " Unknow location name"
                };
                cl(pos, err);
            };
            getJSON(url, fc, fc);

        }, function() {
            findByIP(cl, err);
        });
    } else { // without HTML5 Geolocation
        findByIP(cl, err);
    }
}

/**
 * Find location with usage external IP location service. If is location found, call cl, otherwise err function.
 * @param cl function, which is called in case of success with parameter position
 * @param err function, which is called in case of error
 */
function  findByIP(cl, err) {
    getJSON("http://ip-api.com/json", function (response) {
        var pos = {
            lat: response.lat,
            lng: response.lon,
            address: response.city + ", " + response.country
        };
        cl(pos, err);
    }, err);
}

function error(err) {
    document.getElementById("error").style.display = "block"; // show weather div
    document.getElementById("loader").style.display = "none"; // hide loader
}

function switchTemperatures() {
    document.getElementById("temperature").innerHTML = isCelsius ? kelvinToFahr(kelvin) + "°F" : kelvinToCelsius(kelvin) + "°C";
    document.getElementById("switch-temp").innerHTML = isCelsius ? "°C" : "°F";
    isCelsius = !isCelsius;
}

/**
 * Get weather info via API from OpenWeatherMap a displays it.
 * @param pos position of the user
 * @err err function, which is called when connection to API failed
 */
function showWeather(pos, err) {
    var appid = "bd7405d0ac546bd7c95056e861356b2b";
    var url = "http://api.openweathermap.org/data/2.5/weather?lat=" + pos.lat + "&lon=" + pos.lng +"&APPID=" + appid;
    getJSON(url, function (res) {
        var icons = {
            "01d": "wi-day-sunny", "01n": "wi-night-clear",
            "02d": "wi-day-cloudy", "02n": "wi-night-alt-cloudy",
            "03d": "wi-cloud", "03n": "wi-cloud",
            "04d": "wi-cloudy", "04n": "wi-cloudy",
            "09d": "wi-showers", "09n": "wi-showers",
            "10d": "wi-rain", "10n": "wi-rain",
            "11d": "wi-thunderstorm", "11n": "wi-thunderstorm",
            "13d": "wi-snow", "13n": "wi-snow",
            "50d": "wi-fog", "50n": "wi-fog"
        };

        document.body.style.backgroundImage = "url(images/"+res.weather[0].icon +".jpg)";
        document.getElementById("location").innerHTML = pos.address;
        document.getElementById("temperature").innerHTML = kelvinToCelsius(res.main.temp) + "°C";
        kelvin = res.main.temp; // For conversion Celsius/Fahrenheit
        isCelsius = true; // For conversion Celsius/Fahrenheit
        document.getElementById("switch-temp").addEventListener("click", switchTemperatures);
        document.getElementById("pressure").innerHTML = res.main.pressure + " hPa";
        document.getElementById("humidity").innerHTML = res.main.humidity + "%";
        document.getElementById("description").innerHTML = res.weather[0].description;
        document.getElementById("wind-speed").innerHTML = res.wind.speed + "m/s";
        document.getElementById("wind-icon").classList.add("towards-"+Math.round(res.wind.deg)+"-deg");
        document.getElementById("weather-icon").classList.add(icons[res.weather[0].icon]);
        document.getElementById("weather").style.display = "inline-block"; // show weather div
        document.getElementById("loader").style.display = "none"; // hide loader
    }, err);
}
findLocation(showWeather, error);