var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var OrganiserSchema = new Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        unique: true,
        required: true
    },
    display_name: {
        type: String,
        required: true
    },
    events: [{
        type: Schema.Types.ObjectId,
        ref: 'Events'
    }]
});

var Organiser = mongoose.model('Organiser', OrganiserSchema);

module.exports = Organiser;
