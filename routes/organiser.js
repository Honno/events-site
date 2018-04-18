var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser');

router.get('/register', (req, res) => {
    res.render('register', { session: req.session });
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
                res.render('register', {
                    error: err,
                    session: req.session
                });
            } else {
                req.session.user_id = organiser._id;
                req.session.name = organiser.display_name;

                res.redirect('/profile/id/' + organiser._id);
            }
        });
    } else {
        res.status(status.BAD_REQUEST);
        res.render('register', {
            error: "Not all parameters provided.",
            session: req.session
        });
    }
});

router.get('/login', (req, res) => {
    res.render('login', { session: req.session });
});

router.post('/login', function(req, res) {
    if(req.body.email &&
       req.body.password) {
        Organiser.auth(req.body.email, req.body.password, function(err, organiser) {
            if (err) {
                res.status(status.BAD_REQUEST);
                res.render('login', {
                    error: err,
                    session: req.session
                });
            } else {
                req.session.user_id = organiser._id;
                req.session.name = organiser.display_name;

                res.redirect('/profile/id/' + organiser._id);
            }
        });
    } else {
        res.status(status.BAD_REQUEST);
        res.render('login', {
                       error: "Not all parameters provided.",
                       session: req.session
                   });
    }
});

router.get('/logout', (req, res) => {
    req.session.user_id = null;
    req.session.name = null;
    res.redirect('/');
});

router.get('/', (req, res) => {
    if(req.session.user_id) {
        res.redirect('profile/id/' + req.session.user_id);
    } else {
        res.render('profile', { error: "You are not logged in" } );
    }
});

router.get('/id/:id', (req, res) => {
    var id = req.params.id;
    console.log(id);
    if(id) {
        Organiser.findById(id, (err, organiser) => {
            if (err) {
                res.status(status.INTERNAL_SERVER_ERROR);
                res.render('profile', { error: err, session: req.session });
            } else {
                console.log(organiser);
                res.render('profile', {
                    name: organiser.display_name,
                    email: organiser.email,
                    events: organiser.events,
                    session: req.session
                });
            }
        });
    } else {
        res.status(status.BAD_REQUEST);
        res.render('profile', { error: "You are not logged in." });
    }
});

module.exports = router;
