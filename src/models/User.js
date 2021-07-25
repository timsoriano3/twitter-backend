const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: String,
        default: Date.now
    },
    likes: [{
        type: mongoose.Schema.Types.String,
        ref: 'Tweet'
    }],
    retweets: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }
});



module.exports = userSchema;