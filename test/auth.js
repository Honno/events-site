var chai = require('chai');
var expect = chai.expect;

var request = require('superagent');
var status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;

function drop(callback) {
    db.dropCollection('organisers')
        .catch((err) => {})
        .then(db.dropCollection('events')
              .catch((err) => {})
              .then(callback()));
}

var root = "http://localhost:3000";

describe("User", function() {
    var user = {
        email: 'test@test.com',
        password: 'password',
        display_name: 'John Doe'
    };

    var event = {
        name: 'test event',
        body: 'lorem ipsum something something',
        date: {
            year: 2018,
            month: 1,
            day: 2,
            hour: 10
        },
        category: 'other',
        img: 'test/test.jpg'
    };

    before(function(done) {
        var server = require('../server.js').createServer();

        app = server.listen(3000, function() {
            done();
        });
    });

    beforeEach((done) => {
        drop(function() {
            done();
        });
    });

    after(function() {
        drop(function() {
            app.close();
        });
    });

    it("creates an organiser account and remains logged in", function(done) {
        var agent = request.agent();
        agent.post(root + '/organiser/create')
            .send(user)
            .then(function(res) {
                expect(res.statusCode).to.be.equal(status.OK);
                Organiser.findOne({ email: user.email }, function(err, obj) {
                    if(err) {
                        console.log(err.errmsg);
                    }
                    expect(obj).to.be.not.null;

                    agent.get(root + '/organiser/check')
                        .then(function(res) {
                            expect(res.text).to.equal(user.display_name);
                            done();
                        });
                });
            });
    });

    it("logins to existing account", (done) => {
        var agent = request.agent();

        Organiser.create(user, (err, organiser) => {
            agent.post(root + '/organiser/login')
                .send({ email: user.email, password: user.password })
                .then((res) => {
                    expect(res.statusCode).to.be.equal(status.OK);

                    agent.get(root + '/organiser/check')
                        .then((res) => {
                            expect(res.text).to.equal(user.display_name);

                            agent.post(root + '/events/create')
                                .field('body', event.body)
                                .field('name', event.name)
                                .field('year', event.date.year)
                                .field('month', event.date.month)
                                .field('day', event.date.day)
                                .field('hour', event.date.hour)
                                .field('category', event.category)
                                .attach('img', event.img)
                                .then((res) => {
                                    expect(res.status).to.equal(status.CREATED);

                                    done();
                                });
                        });
                });
        });
    });
});
