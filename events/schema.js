const mongoose = require('moongoose');
const Schema = mongoose.Schema;

module.exports = new Schema(
    event_name: String,
    body: String,
    date: Date,
    img: {
        data: Buffer,
        contentType: String
    },
    likes: {
        type: Number,
        default: 0
    },
    hidden: {
        type: Boolean,
        default: false
    },

    // organiser info
    organiser_id: {
        type: Schema.Types.ObjectId,
        ref: 'Organisers'
    },
    organiser_name: String,
);
