var router = require('express').Router();

var status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

function sort_name (a, b) {
    return b.event_name.toLowerCase() < a.event_name.toLowerCase();
}

function sort_date (a, b) {
    return b.date - a.date;
}

function sort_likes (a, b) {
    return b.likes - a.likes;
}

router.get('/', (req, res) => {
    if (!('view' in req.session)) {
        req.session.view = {};
    }
    var view = req.session.view;

    if (req.query.category) {
        if(req.query.category == 'all') {
            view.category = null;
        } else {
            view.category = req.query.category;
        }
    } else {
        if (!('category' in view)) view.category = null;
    }
    var query = {};
    if (view.category) query = { category: view.category };

    if (req.query.sort) {
        view.sort = req.query.sort;
    } else {
        if (!('sort' in view)) view.sort = null;
    }

    var events = [];
    var cursor = Event.find(query).cursor();
    cursor.on('data', (event) => {
        events.push(event);
    });

    cursor.on('close', () => {
        switch (view.sort) {
        case 'name':
            events.sort(sort_name);
            break;
        case 'date':
            events.sort(sort_date);
            break;
        case 'likes':
            events.sort(sort_likes);
            break;
        }

        req.session.view = view;

        res.render('index', {
            events: events,
            session: req.session
        });
    });
});

module.exports = router;
