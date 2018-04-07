var router = require('express').Router();

var Organiser = require('../models/organiser');

router.post('/create', function(req, res) {
    console.log("User creation requested.");

    if(req.body.email &&
       req.body.password &&
       req.body.display_name) {
        console.log("Necessary information given.");

        var data = {
            email: req.body.email,
            password: req.body.password,
            display_name: req.body.display_name
        };

        Organiser.create(data, function(err, organiser) {
            if (err) {
                console.log(err);
            } else {
                console.log("Organiser successfully created");
                req.session.userId = organiser._id;
                res.send("woo");
            }
        });
    } else {
        res.status(400);
        res.send("hmm");
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
                req.session.userId = organiser._id;
                res.send("yay");
            }
        })
    }
})

module.exports = router;
