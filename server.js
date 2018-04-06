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
