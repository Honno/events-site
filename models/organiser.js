var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require('bcrypt');

var OrganiserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    events: [{
        id: Schema.Types.ObjectId,
        name: String
    }]
});

OrganiserSchema.statics.auth = function (email, password, callback) {
    Organiser.findOne({ email: email })
        .exec(function (err, organiser) {
            if (err) {
                return callback(err);
            } else if (!organiser) {
                err = new Error('Organiser not found.');
                err.status = 401;
                return callback(err);
            }
            bcrypt.compare(password, organiser.password, function (err, result) {
                if (result) {
                    return callback(null, organiser);
                } else {
                    return callback();
                }
            });
        });
}

OrganiserSchema.pre('save', function(next) {
    var organiser = this;
    bcrypt.hash(organiser.password, 10, function (err, hash) {
        if (err) {
            return next(err);
        }
        organiser.password = hash;
        next();
    });
});

var Organiser = mongoose.model('Organiser', OrganiserSchema);
module.exports = Organiser;
