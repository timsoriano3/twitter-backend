const express = require('express');

const { messagePost, chatIdMessagesGet } = require('../controllers/messageController');

const app = express();
const messageRouter = express.Router();

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

    // Post message in chat with given chatId as params
    .post((req, res, next) => { 
        console.log("Attempting to send message");
        next();
    },
    messagePost
    );




module.exports = messageRouter;