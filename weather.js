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

}

findLocation();