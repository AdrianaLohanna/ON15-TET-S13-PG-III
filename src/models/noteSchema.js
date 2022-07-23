const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
    id: mongoose.Schema.Types.ObjectId,
    author: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    tag: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "tag"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('note', noteSchema);