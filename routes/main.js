var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/', (req, res) => {
    res.render('index', { title: "hi", message: "das" });
});



module.exports = router;
