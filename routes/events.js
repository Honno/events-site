var router = require('express').Router();

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

router.post('/', function (req, res) {
    if(req.body.name &&
       req.body.body &&
       req.body.date &&
       req.body.category &&
       req.body.img) {
        data = {
            event_name: req.body.name,
            body: req.body.body,
            date: req.body.date,
            category: req.body.category,
            img: req.body.img
        };

        Event.create(data, function (err, event) {
            if (err) {
                console.log(err);
            } else {
                res.send("woo");
            }
        });
    } else {
        res.status(400);
        res.send("woops");
    }
});

module.exports = router;
