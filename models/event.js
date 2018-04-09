const mongoose = require('moongoose');
const Schema = mongoose.Schema;

var EventSchema = new Schema(
    event_name: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        enum: ['sports', 'cultural', 'other'],
        required: true
    },
    img: {
        data: Buffer,
        contentType: String,
        required: true
    },
    likes: {
        type: Number,
        default: 0
    },
    organiser_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisers'
    },
    organiser_name: String; // denormalised organiser name for quicker requests
);

var Event = mongoose.model('Event', EventSchema);
module.exports = Event;
