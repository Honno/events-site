var express = require('express');

var session = require('express-session');
var cookie_parser = require('cookie-parser');
var parse = require('body-parser');
var routes = require('./routes');

var mongoose = require('mongoose');
var mongo_uri = 'mongodb://localhost';
mongoose.connect(mongo_uri);
var store = require('connect-mongodb-session')(session);

exports.createServer = function () {
    /* create server */
    var server = express();

    /* specify middleware */
    // record user sessions
    server.use(cookie_parser());
    server.use(session({
        secret: 'stoplooking',
        resave: true,
        saveUninitialized: false,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24
        },
        store: new store({
            uri: mongo_uri,
            databaseName: 'admin',
            collection: 'sessions'
        })
    }));

    // allow data to be parsed
    server.use(parse.json());
    server.use(parse.urlencoded({ extended: false }));

    // use defined routers
    routes(server);

    /* return server */
    return server;
}

/*
var express = require('express');
var app = express();
var session = require('express-session');
var parse = require('body-parser');
var mongoose = require('mongoose');
var organisers = require('./routes/router');

mongoose.connect('mongodb://localhost');
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("aaaaah");
});

app.use(session({
    secret: 'stoplooking',
    resave: true,
    saveUninitialized: false
}));

app.use(parse.json());
app.use(parse.urlencoded({extended: false}));

app.use('/', organisers);

app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.send(err.message);
});

app.listen(3000, function() {
    console.log('listenin\' on 3000')
});
*/
