var router = require('express').Router();

var status = require('http-status');
var busboy = require('busboy');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/event', function (req, res) {
    if (req.body.id) {
        res.send(Event.findById(req.body.id));
    } else if (req.body.name) {
        res.send(Event.find({ event_name: req.body.name }));
    } else {
    }
});

router.get('/create', function (req, res) {
    res.render('create');
});

router.post('/create', function (req, res) {
    console.log(req.body);
    console.log(req.file);
    console.log(req.files);

    if (req.session.user_id) {
        if(req.body.name &&
           req.body.body &&
           req.body.date &&
           req.body.time &&
           req.body.category &&
           req.files.img) {

            var data = {
                event_name: req.body.name,
                body: req.body.body,
                date: new Date(req.body.date + 'T' + req.body.time),
                category: req.body.category,
                img: req.files.img.data,
                organiser_id: req.session.user_id,
                organiser_name: req.session.name
            };

            Event.create(data, function (err, event) {
                if (err) {
                    res.status(status.INTERNAL_SERVER_ERROR);
                    res.render('create', { error: err });
                } else {
                    res.status(status.CREATED);
                    res.redirect('event?id=' + event._id);
                }
            });
        } else {
            res.status(status.BAD_REQUEST);
            res.render('create', { error: "Not all information provided"});
        }
    } else {
        res.status(status.UNAUTHORIZED);
        res.render('create', { error: "You must be logged in"});
    }
});

module.exports = router;
