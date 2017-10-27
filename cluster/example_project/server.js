var http = require('http');

var handleRequest = function(request, response) {

    console.log(`${Date.now()} -> Hello World!` + request.url);
    response.writeHead(200);
    response.end(`${Date.now()} -> Hello World!`);

};


var www = http.createServer(handleRequest);
www.listen(5000);
console.log('Server listen on 5000');