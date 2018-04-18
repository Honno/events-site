var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/', (req, res) => {
    var events = [];

    var cursor = Event.find().cursor();
    cursor.on('data', (event) => {
        events.push(event);
    });

    cursor.on('close', () => {
        res.render('index', {
            events: events,
            session: req.session
        });
    });
});

module.exports = router;
