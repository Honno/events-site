var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/', (req, res) => {
    var events = [];

    var cursor = Event.find().cursor();
    cursor.on('data', (event) => {
        console.log(event);
        events.push({
            event_name: event.event_name,
            event_id: event._id,
            body: event.body,
            date: event.date,
            category: event.category,
            img_data: event.img_data,
            img_mime: event.img_mime,
            likes: event.likes,
            organiser_id: event.organiser_id,
            organiser_name: event.organiser_name
        });
    });

    console.log(events);
    cursor.on('close', () => {
        res.render('index', { events: events });
    });
});



module.exports = router;
