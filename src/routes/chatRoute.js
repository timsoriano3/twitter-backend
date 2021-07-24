const express = require('express');

// middlewares for all chat functions from chatController.js
const { 
    chatPost, 
    chatGet, 
    chatIdPut, 
    chatIdGet
} = require('../controllers/chatController');

const app = express();
const chatRouter = express.Router();

// body-parser
app.use(express.json());


chatRouter.route("/")
    // Get all chats under logged in user
    .get((req, res, next) => {
        console.log("attempting to get chats");
        next();
    },
    chatGet
    )

    // Creating a new chat
    .post((req, res, next) => {
        console.log("attempting chat");
        next();
    }, 
    chatPost
    );

chatRouter.route('/:chatId')
    // Get chat data by the given chatId
    .get((req, res, next) => {
        console.log("attempting to get chats");
        next();
    },
    chatIdGet
    )

    // Changing chat title of chat with the given chatId
    .put((req, res, next) => {
        console.log("attempting to change chat name");
        next();
    },
    chatIdPut
    );



module.exports = chatRouter;