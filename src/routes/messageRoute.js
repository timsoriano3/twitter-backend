const express = require('express');

// middlewares for posting a message in a specific chat
// and getting all messages in a specific chat
// from messageController.js
const { messagePost, chatIdMessagesGet } = require('../controllers/messageController');

const app = express();

// merging params in order to retrieve and post messages from chatId
const messageRouter = express.Router({mergeParams: true});

// body-parser
app.use(express.json());


messageRouter.route('/')
    // Get all messages in the current chat
    .get((req, res, next) => {
        console.log("attempting to get chats");
        next();
    },
    chatIdMessagesGet
    )

    // Post message in chat with given chatId
    .post((req, res, next) => { 
        console.log("Attempting to send message");
        next();
    },
    messagePost
    );




module.exports = messageRouter;