var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser');

router.post('/create', function(req, res) {
    console.log("Organiser creation requested");

    if(req.body.email &&
       req.body.password &&
       req.body.display_name) {
        console.log("Necessary information given");

        var data = {
            email: req.body.email,
            password: req.body.password,
            display_name: req.body.display_name
        };

        Organiser.create(data, function(err, organiser) {
            if (err) {
                console.log(err.errmsg);
                if (err.code === 11000) {
                    res.status(status.CONFLICT)
                        .send("Organiser with given email already exists");
                } else {
                    res.send(err.errmsg);
                }
            } else {
                console.log("Organiser successfully created");
                req.session.user_id = organiser._id;
                res.send(req.session);
            }
        });
    } else {
        res.status(status.BAD_REQUEST)
            .send(status[400]);
    }
});

router.post('/login', function(req, res) {
    if(req.body.email &&
       req.body.password) {
        Organiser.auth(req.body.email, req.body.password, function(err, organiser) {
            if (err || !organiser) {
                res.status(401);
                res.send("Wrong email or password");
            } else {
                req.session.user_id = organiser._id;
                res.send(req.session);
            }
        });
    }
});

router.get('/check', function(req, res) {
    if (req.session.user_id) {
        Organiser.findById(req.session.user_id, function(err, obj) {
            if (err) {
                res.status(status.INTERNAL_SERVER_ERROR);
                res.send("User session recognized but not found in DB");
            } else {
                res.send(obj._doc.display_name);
            }
        });
    } else {
        res.send("You are not logged in");
    }
});

module.exports = router;
