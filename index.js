var server = require('./server.js').createServer();

var port = process.env.PORT || 3000;

server.listen(port, function() {
    console.log("Server is running");
});
