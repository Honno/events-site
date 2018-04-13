var router = require('express').Router();

var status = require('http-status');
var busboy = require('busboy');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/event/:id', function (req, res) {
    Event.findById(req.params.id, (err, event) => {
        if (err) {
            res.status(status.INTERNAL_SERVER_ERROR);
            res.render('event', { error: err });
        } else {
            var data = {
                event_name: event.event_name,
                organiser_id: event.organiser_id,
                organiser_name: event.organiser_name,
                body: event.body,
                img_mime: event.img_mime,
                img_base64: event.img_data.toString('base64')
            };
            res.render('event', data);
        }
    });
});

router.get('/create', function (req, res) {
    res.render('create');
});

router.post('/create', function (req, res) {
    var id = req.session.user_id;
    if (id) {
        if(req.body.name &&
           req.body.body &&
           req.body.date &&
           req.body.time &&
           req.body.category &&
           req.files.img) {
            var data = {
                event_name: req.body.name,
                body: req.body.body,
                date: new Date(req.body.date +
                               'T' +
                               req.body.time),
                category: req.body.category,
                img_data: req.files.img.data.toString('base64'),
                img_mime: req.files.img.mimetype,
                organiser_id: id,
                organiser_name: req.session.name
            };

            Event.create(data, function (err, event) {
                if (err) {
                    res.status(status.INTERNAL_SERVER_ERROR);
                    res.render('create', { error: err });
                } else {
                    var mini_event = {
                        id: event._id,
                        name: event.event_name
                    };

                    Organiser.findByIdAndUpdate(
id, { $push: { events: mini_event}}, (err, organiser) => {
    if (err) {
        res.status(status.internal_server_error);
        res.render('create', { error: err });
    } else {
        res.status(status.created);
        res.redirect('event/' + event._id);
    }
});
                }
            });
        } else {
            res.status(status.bad_request);
            res.render('create', { error: "not all information provided"});
        }
    } else {
        res.status(status.unauthorized);
        res.render('create', { error: "you must be logged in"});
    }
});

module.exports = router;
