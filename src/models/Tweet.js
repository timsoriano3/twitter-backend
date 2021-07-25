const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tweetSchema = new Schema({
    content: {
        type: String,
        trim: true
    },
    tweetedBy: {
        type: mongoose.Schema.Types.String,
        ref: 'User'
    },
    likes: [{
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }],
    retweetByUsers: [{
        type: mongoose.Schema.Types.String,
        ref: 'User'
    }],
    retweetedTweet: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tweet'
    }
}, {
    timestamps: true
});

const Tweet = mongoose.model('Tweet', tweetSchema);
module.exports = Tweet;