var express = require('express');
var router = express.Router();

var Organiser = require('../models/organiser');

router.get('/', function (req, res) {
    return res.send("hi");
});

router.post('/', function(req, res, next) {
    if(req.body.email &&
       req.body.password &&
       req.body.display_name) {

        console.log("postin'");

        var data = {
            email: req.body.email,
            password: req.body.password,
            display_name: req.body.display_name
        };

        Organiser.create(data, function(err, organiser) {
            if (err) {
                console.log(err);
            } else {
                req.session.userId = organiser._id;
                return res.redirect('/profile');
            }
        });
    }
});

module.exports = router;
