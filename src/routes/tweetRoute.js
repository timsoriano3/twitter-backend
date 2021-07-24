const express = require('express');

// chats middlewares for from chatController.js
const { 
    tweetGet,
    tweetPost,
    tweetIdGet,
    tweetIdPut,
    tweetIdDelete
} = require('../controllers/tweetController');

const app = express();
const tweetRouter = express.Router();

// body-parser
app.use(express.json());


tweetRouter.route("/")
    // Get all tweets under logged in user
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
    .get((req, res, next) => {
        console.log("Getting a tweet by tweetId and reading its content");
        next();
    },
    tweetIdGet
    )
    .put((req, res, next) => {
        console.log("Updating a tweet");
        next();
    },
    tweetIdPut
    )

    .delete((req, res, next) => {
        console.log("Deleting a tweet");
        next();
    },
    tweetIdDelete
    );

module.exports = tweetRouter;