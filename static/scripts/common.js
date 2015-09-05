function ajaxRequest(url, body, callback) {
    var request = new XMLHttpRequest();
    request.open("PUT", url, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4)
        {
            if (request.status == 200 && request.getResponseHeader("Content-Length") > 0) {
                call(callback, JSON.parse(request.responseText));
            } else {
                call(callback, request.status);
            }
        }
    }
    request.send(JSON.stringify(body));
}

function call(callback, object) {
    if (callback) {
        callback(object);
    }
}