const chai = require('chai');
const expect = chai.expect;

const request = require('superagent');
const status = require('http-status');

var Organiser = require('../models/organiser.js');
var Event = require('../models/event.js');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost');
var db = mongoose.connection;

function drop(db) {
    db.dropCollection('organisers');
}

var root = "http://localhost:3000";

describe("User", function() {
    var user = {
        email: 'test@test.com',
        password: 'password',
        display_name: 'John Doe'
    };

    before(function(done) {
        var server = require('../server.js').createServer();

        drop(db);

        app = server.listen(3000, function() {
            done();
        });
    });

    after(function() {
        drop(db);

        app.close();
    });

    it("creates an organiser account", function(done) {
        request.post(root + '/organiser/create')
            .send(user)
            .then(function(res) {
                expect(res.statusCode).to.be.equal(status.OK);
                Organiser.findOne({ email: user.email }, function(err, obj) {
                    expect(obj).to.be.not.null;
                });
                done();
            });
    });
});
