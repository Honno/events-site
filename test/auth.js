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
        .catch(function (err) {
            console.log("Organisers table could not be dropped because it didn't exist");
        })
        .then(callback());
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

        app = server.listen(3000, function() {
            drop(function() {
                done();
            });
        });
    });

    after(function() {
        drop(function() {
            app.close();
        });
    });

    it("creates an organiser account and remain logged in", function(done) {
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

                    return agent.get(root + '/organiser/check')
                        .then(function(res) {
                            expect(res.text).to.equal(user.display_name);
                            done();
                        });
                });
            });
    });
});
