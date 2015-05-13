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
    navigator.geolocation.getCurrentPosition(calcRoute);
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
}

function sendEmail() {
  var name = document.getElementById('contactName');
  var email = document.getElementById('contactEmail');
  var message = document.getElementById('contactMessage');

  var body = {};
  body.name = name;
  body.email = email;
  body.message = message;

  ajaxRequest('contact', body, function(status) {
    if (status === 200) {
      displayMessage('Email successfully sent.');
    } else {
      displayMessage('Unfortunately, an error occured. Please try again in a few minutes.');
    }
  })
}

function ajaxRequest(url, body, callback) {
  var request = new XMLHttpRequest();
  request.open("POST", url, true);

  request.onreadystatechange = function() {
      if (request.readyState == 4)
      {
          if (request.status == 200 && request.getResponseHeader("Content-Length") > 0) {
              callback(JSON.parse(request.responseText));
          } else {
              callback(request.status);
          }
      }
  }
  try {
    request.send(JSON.stringify(body));
  } catch (ex) {
    callback(500);
  }
}

function displayMessage(message) {
  document.getElementById('info').innerHTML = message;
}