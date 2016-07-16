function findLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                address: ""
            };
            var xhttp = new XMLHttpRequest();
            xhttp.open("GET", "http://maps.googleapis.com/maps/api/geocode/json?latlng=" + pos.lat + "," + pos.lng, false);
            xhttp.send();
            var response = JSON.parse(xhttp.responseText);

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
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "http://ip-api.com/json", false);
    xhttp.send();
    var response = JSON.parse(xhttp.responseText);
    var pos = {
        lat: response.lat,
        lng: response.lon,
        address: response.city + ", " + response.country
    };
    showWeather(pos);
}

function showWeather(position) {
    console.log(position);
}

findLocation();
findByIP();