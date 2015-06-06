var directionsDisplay;
var directionsService;
var map;

function initialize() {
  var vintners = new google.maps.LatLng(46.7946688, -100.742319);
  var mapOptions = {
    center: vintners,
    zoom: 16,
    mapTypeId: google.maps.MapTypeId.HYBRID
  }
  map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

  var marker = new google.maps.Marker({
    position: vintners,
    map: map,
    title: "Vintner's Winery"
  })
}

function calculateRoute() {
  if (navigator.geolocation) {
    displayMessageOnFind("Calculating...");
    navigator.geolocation.getCurrentPosition(calcRoute, calcRouteError);
  } else {
    displayMessageOnFind("Geolocation not supported by browser.");
  }
}

function calcRoute(pos) {
  if (!pos) {
    return;
  }
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer({draggable: true});
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById("map-directions"));
  var request = {
    origin:new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
    destination: "3250 Rock Island Place Suite #5 Bismarck ND 58504",
    travelMode: google.maps.TravelMode.DRIVING
  };
  directionsService.route(request, function(result, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(result);
    }
  });
  displayMessageOnFind("");
}

function calcRouteError(err) {
  var message = "";
  switch (err.code) {
    case 1:
      message = "Permission was not granted to use your location.";
      break;
    case 2:
      message = "Could not calculate your location.";
      break;
    case 3:
      message = "Timed out retreiving directions.";
      break;
  }
  displayMessageOnFind(message);
}

function displayMessageOnFind(message) {
  document.getElementById('calc').innerHTML = message;
}