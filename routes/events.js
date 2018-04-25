var router = require('express').Router();

var status = require('http-status');
var busboy = require('busboy');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

router.get('/id/:id', function (req, res) {
    Event.findById(req.params.id, (err, event) => {
        if (err || !event) {
            res.status(status.INTERNAL_SERVER_ERROR);
            res.render('error', {
                error: err,
                session: req.session
            });

        } else {
            var session;
            if('user_id' in req.session) {
                if(req.session.user_id == event.organiser_id) {
                    session = req.session;
                } else {
                    session = null;
                }
            } else {
                session = null;
            }

            var liked = false;
            if ('likes' in req.session) {
                liked = req.session.likes.indexOf(event._id.toString()) >= 0;
            }

            res.render('event', {
                event: event,
                liked: liked,
                session: req.session
            });
        }
    });
});

router.get('/create', function (req, res) {
    res.render('create_event', { session: req.session });
});

router.post('/create', function (req, res) {
    var id = req.session.user_id;
    if (id) {
        if(req.body.name &&
           req.body.body &&
           req.body.location &&
           req.body.date &&
           req.body.time &&
           req.body.category &&
           req.files.img) {

            var data = {
                event_name: req.body.name,
                body: req.body.body,
                location: req.body.location,
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
                    res.render('create_event', { error: err, session: req.session });
                } else {
                    var mini_event = {
                        id: event._id,
                        name: event.event_name
                    };

                    Organiser.findByIdAndUpdate(id, {
                        $push: { events: mini_event}
                    },
(err, organiser) => {
    if (err) {
        res.status(status.internal_server_error);
        res.render('create_event', {
            error: err,
            session: req.session
        });
    } else {
        res.status(status.CREATED);
        res.redirect('/events/id/' + event._id);
    }
});
                }
            });
        } else {
            res.status(status.BAD_REQUEST);
            res.render('create_event', {
                error: "Not all information provided",
                session: req.session
            });
        }
    } else {
        res.status(status.UNAUTHORIZED);
        res.render('create_event', {
            error: "You must be logged in",
            session: req.session
        });
    }
});

router.get('/update/:id', (req, res) => {
    Event.findById(req.params.id, (err, event) => {
        if (err) {
            res.render('update_event', {
                error: err,
                session: req.session
            });

        } else {
            if (req.session.user_id.toString() != event.organiser_id) {
                res.render('update_event', {
                    error: "You are not permitted to edit this event",
                    session: req.session
                });
            } else {
                var date = event.date;

                var data = {
                    event_name: event.event_name,
                    event_id: event._id,
                    organiser_id: event.organiser_id,
                    organiser_name: event.organiser_name,
                    body: event.body,
                    location: event.location,
                    date: date.toISOString().substring(0, 10),
                    time: date.toISOString().substring(11, 16),
                    category: event.category,
                };

                res.render('update_event', {
                    event: data,
                    session: req.session
                });
            }
        }
    });
});

router.post('/update', (req, res) => {
    if(req.session.user_id != req.body.organiser_id) {
        res.render('update_event', {
            error: "You are not permitted to update this event",
            session: req.session
        });
    } else {
        if ('img' in req.files) {
            Event.update({ _id: req.body.event_id },
                         { img_data: req.files.img.data.toString('base64'),
                           img_mime: req.files.img.mimetype },
                         (err, raw) => {
                             if (err) {
                                 res.render('update_event', {
                                     error: err,
                                     session: req.session
                                 });
                             } else {
                                 res.redirect('/events/id/' + req.body.event_id);
                             }
                         });

        } else if (req.body.name &&
                   req.body.body &&
                   req.body.location &&
                   req.body.date &&
                   req.body.time &&
                   req.body.category)
        {
            var data = {
                event_name: req.body.name,
                body: req.body.body,
                location: req.body.location,
                date: new Date(req.body.date +
                               'T' +
                               req.body.time),
                category: req.body.category
            };

            Event.update({ _id: req.body.event_id },
                         data,
                         (err, raw) => {
                             if (err) {
                                 res.render('update_event', {
                                     error: err,
                                     session: req.session
                                 });
                             } else {
                                 res.redirect('/events/id/' + req.body.event_id);
                             }
                         });
        }
    }
});

router.post('/like', (req, res) => {
    if ('likes' in req.session && req.session.likes.indexOf(req.body.event_id) >= 0) {
        res.render('error', { error: "You have already liked this event" });

    } else {
        if (!('likes' in req.session)) {
            req.session.likes = [];
        }
        req.session.likes.push(req.body.event_id);

        Event.findOneAndUpdate({ _id: req.body.event_id },
                               { $inc: { likes: 1 } },
                               (err, event) => {
                                   if (err) {
                                       res.render('error', {
                                           error: err,
                                           session: req.session
                                       });

                                   } else {
                                       res.redirect('/events/id/' + req.body.event_id);
                                   }
                               });
    }
});

router.post('/unlike', (req, res) => {
    if ('likes' in req.session && req.session.likes.indexOf(req.body.event_id) < 0) {
        res.render('error', { error: "You have already unliked this event" });

    } else {
        if ('likes' in req.session) {
            req.session.likes.splice(req.session.likes.indexOf(req.body.event_id), 1);
        }

        Event.findOneAndUpdate({ _id: req.body.event_id },
                               { $inc: { likes: -1 } },
                               (err, event) => {
                                   if (err) {
                                       res.render('error', {
                                           error: err,
                                           session: req.session
                                       });

                                   } else {
                                       res.redirect('/events/id/' + req.body.event_id);
                                   }
                               });
    }
});

router.post('/delete', (req, res) => {
    function check_event_auth (callback) {
        Event.findById(req.body.event_id.toString(), (err, event) => {
            if (err | !event) {
                res.render('error', {
                    error: err,
                    session: req.session
                });
            } else {
                if (req.session.user_id.toString() == event.organiser_id) {
                    callback();
                } else {
                    res.render('error', {
                        error: "Not authorized to delete event",
                        session: req.session
                    });
                }
            }
        });
    }

    function remove_event (callback) {
        Event.findByIdAndRemove(req.body.event_id, (err, event) => {
            if (err) {
                res.render('error', {
                    error: err,
                    session: req.session
                });
            } else {
                callback(event);
            }
        });
    }

    function update_organiser (event, callback) {
        var search_query = { _id: event.organiser_id };
        var update_query = { $pull: { events: { id: req.body.event_id } } };

        Organiser.findOneAndUpdate(search_query, update_query, (err, organiser) => {
            if (err) {
                res.render('error', {
                    error: err,
                    session: req.session
                });
            } else {
                callback();
            }
        });
    }

    check_event_auth(() => {
        remove_event((event) => {
            update_organiser(event, () => { res.redirect('/profile'); });
        });
    });
});

module.exports = router;
