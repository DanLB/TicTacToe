
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