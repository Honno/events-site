var express = require('express');

var session = require('express-session');
var cookie_parser = require('cookie-parser');
var parse = require('body-parser');
var busboy_parse = require('busboy-body-parser');
var moment = require('moment');
var routes = require('./routes');

var mongoose = require('mongoose');
var mongo_uri;
if(process.env.NODE_ENV === 'production')
    mongo_uri = 'mongodb://admin:password@ds253959.mlab.com:53959/aston-events';
else
    mongo_uri = 'mongodb://localhost:27017/';
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
    }));

    // allow data to be parsed
    server.use(parse.json());
    server.use(parse.urlencoded({ extended: false }));
    server.use(busboy_parse());

    // attatch defined routers
    routes(server);

    /* other fancy stuff */
    // add momentjs functionality
    server.locals.moment = moment;

    // local icon set
    server.use('/icons', express.static(__dirname + '/views/svg'));

    /* return server */
    return server;
};
