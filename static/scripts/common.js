function ajaxRequest(url, body, callback) {
    var request = new XMLHttpRequest();
    request.open("PUT", url, true);

    request.onreadystatechange = function() {
        if (request.readyState == 4)
        {
            if (request.status == 200) {
                return callback(JSON.parse(request.responseText));
            } else {
                return callback(request.status);
            }
        }
    }
    request.send(JSON.stringify(body));
}