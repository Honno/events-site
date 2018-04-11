var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser');

router.get('/register', (req, res) => {
    res.render('register', { h2: 'Register' });
});

router.post('/register', function(req, res) {
    console.log(req.body);
    if(req.body.email &&
       req.body.password &&
       req.body.display_name) {

        var data = {
            email: req.body.email,
            password: req.body.password,
            display_name: req.body.display_name
        };

        Organiser.create(data, function(err, organiser) {
            if (err) {
                res.status(status.BAD_REQUEST);
                res.render('register', { error: err });
            } else {
                req.session.user_id = organiser._id;
                req.session.name = organiser.display_name;

                res.redirect('/profile');
            }
        });
    } else {
        res.status(status.BAD_REQUEST);
        res.render('register', { error: "Not all parameters provided." });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', function(req, res) {
    if(req.body.email &&
       req.body.password) {
        Organiser.auth(req.body.email, req.body.password, function(err, organiser) {
            if (err) {
                res.status(status.BAD_REQUEST);
                res.render('login', { error: err });
            } else {
                req.session.user_id = organiser._id;
                req.session.name = organiser.display_name;

                res.send(req.session);
            }
        });
    } else {
        res.status(status.BAD_REQUEST);
        res.render(login, { error: "Not all parameters provided." });
    }
});

module.exports = router;
