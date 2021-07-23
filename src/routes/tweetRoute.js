const express = require('express');

// chats middlewares for from chatController.js
const { 
    chatPost, 
    chatGet, 
    chatIdPut, 
    chatIdGet
} = require('../controllers/chatController');

const app = express();
const tweetRouter = express.Router();

// body-parser
app.use(express.json());


tweetRouter.route("/")
    // Get all chats under logged in user
    .get((req, res, next) => {
        console.log("attempting to get chats");
        next();
    },
    chatGet
    )

    // Creating a chat
    .post((req, res, next) => {
        console.log("attempting chat");
        next();
    }, 
    chatPost
    );


module.exports = tweetRouter;