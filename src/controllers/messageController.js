const mongoose = require('mongoose');
const Message = require('../models/Message');
const Chat = require('../models/Chat');

mongoose.set('useFindAndModify', false);


// middleware for ("/") .post method for messageRoute
// function to post message to chat with chatId as params
exports.messagePost = async (req, res) => {

    // Finding a chat by chat id given as params
    const chat = await Chat.findById(req.params.chatId)
    var userInChat = false;

    // check to see if logged in user is part of the chat
    chat.users.forEach( (user) => {
        if (user == req.session.user.username) {
            userInChat = true;
        }
    });

    // if user is not part of the specified chat, return unauthorized message
    if (!userInChat) {
        return res.status(401).json({
            message: "You are unauthorized to view this chat"
        })
    }

    // check if content in the request is empty
    if (!req.body.content) {
        console.log("Content must not be empty!");
        return res.status(400).json({
            message: "Content must not be empty!"
        });
    }

    // create message in db with the following properties
    Message.create({
        fromUser: req.session.user.username,
        content: req.body.content,
        chat: req.params.chatId
    }
    , (err, message) => {
        if (err) {
            console.log(err);
            res.status(400).json({err: err});
        } else {
            res.status(201).json({
                status: "Message sent",
                message: message
            });
        }
    });

};



// middleware for chatRoute /:chatId/messages .get method
// function to get all messages in the chat under given chatId
exports.chatIdMessagesGet = async (req, res) => {

    // Finding a chat by chat id given as params
    const chat = await Chat.findById(req.params.chatId)
    var userInChat = false;

    // check to see if logged in user is part of the chat
    chat.users.forEach( (user) => {
        if (user == req.session.user.username) {
            userInChat = true;
        }
    });

    // if user is not part of the specified chat, return unauthorized message
    if (!userInChat) {
        return res.status(401).json({
            message: "You are unauthorized to view this chat"
        })
    }

    // find a chat with the given chatId as params
    Message.find({ chat: req.params.chatId }
    , (err, messages) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            // set getChat to equal found chat
            res.status(200).json({
                message: "Success",
                chat_messages: messages
            });
        }
    });
    
};