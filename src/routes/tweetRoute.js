const express = require('express');

// middlewares for all tweet functions from tweetController.js
const { 
    tweetGet,
    tweetPost,
    tweetIdGet,
    tweetIdPut,
    tweetIdDelete,
    tweetIdLike,
    tweetIdRetweet
} = require('../controllers/tweetController');

const app = express();
const tweetRouter = express.Router({mergeParams: true});

// body-parser
app.use(express.json());


tweetRouter.route("/")
    // Get all the tweets
    .get((req, res, next) => {
        console.log("Getting all tweets by logged in user");
        next();
    },
    tweetGet
    )

    // Posting a tweet
    .post((req, res, next) => {
        console.log("Posting a tweet");
        next();
    }, 
    tweetPost
    )

tweetRouter.route("/:tweetId")
    // getting a tweet with specific tweet id
    .get((req, res, next) => {
        console.log("Getting a tweet by tweetId and reading its content");
        next();
    },
    tweetIdGet
    )

    // updating the content of a tweet with specific tweet id
    .put((req, res, next) => {
        console.log("Updating a tweet");
        next();
    },
    tweetIdPut
    )

    // deleting a tweet with specific tweet id
    .delete((req, res, next) => {
        console.log("Deleting a tweet");
        next();
    },
    tweetIdDelete
    );

// liking/unliking a tweet
tweetRouter.route('/:tweetId/likes')
    .put( async (req, res, next) => {
        console.log("Attempting to like/unlike tweet");
        next();
    },
    tweetIdLike
    );

// retweeting a tweet
tweetRouter.route('/:tweetId/retweets')
    .post( async (req, res, next) => {
        console.log("Attempting to retweet a tweet");
        next();
    },
    tweetIdRetweet
    );

module.exports = tweetRouter;