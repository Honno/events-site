var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/', function (req, res) {
    if (req.body.id) {
        res.send(Event.findById(req.body.id));
    } else if (req.body.name) {
        res.send(Event.find({ event_name: req.body.name }));
    } else {
        res.send(Event.findOne());
    }
});

router.post('/create', function (req, res) {
    if (req.session.user_id) {
        if(req.body.name &&
           req.body.body &&
           req.body.year &&
           req.body.month &&
           req.body.day &&
           req.body.hour &&
           req.body.category &&
           req.files.img) {

            var data = {
                event_name: req.body.name,
                body: req.body.body,
                date: new Date(
                    req.body.year,
                    req.body.month,
                    req.body.day,
                    req.body.hour),
                category: req.body.category,
                img: req.files.img.data,
                organiser_id: req.session.user_id,
                organiser_name: req.session.name
            };

            Event.create(data, function (err, event) {
                if (err) {
                    res.status(status.INTERNAL_SERVER_ERROR);
                    res.end();
                } else {
                    res.status(status.CREATED);
                    res.end();
                }
            });
        } else {
            res.status(status.BAD_REQUEST);
            res.end();
        }
    } else {
        res.status(status.UNAUTHORIZED);
        res.end();
    }
});

module.exports = router;
