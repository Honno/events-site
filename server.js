var express = require('express');

var session = require('express-session');
var cookie_parser = require('cookie-parser');
var parse = require('body-parser');
var busboy_parse = require('busboy-body-parser');
var moment = require('moment');
var routes = require('./routes');

var mongoose = require('mongoose');
var mongo_uri = 'mongodb://localhost';
mongoose.connect(mongo_uri);
var store = require('connect-mongodb-session')(session);

exports.createServer = function () {
    /* create server */
    var server = express();

    /* specify view engine */
    server.set('views', './views');
    server.set('view engine', 'pug');

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
    server.use(busboy_parse());

    // attatch defined routers
    routes(server);

    // add momentjs functionality
    server.locals.moment = moment;

    /* return server */
    return server;
};
