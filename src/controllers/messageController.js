const mongoose = require('mongoose');
const Message = require('../models/Message');

mongoose.set('useFindAndModify', false);


// middleware for ("/") .post method for messageRoute
exports.messagePost = (req, res) => {
    if (!req.body.content) {
        console.log("Content must not be empty!");
        return res.status(400).json({
            message: "Content must not be empty!"
        });
    }

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
exports.chatIdMessagesGet = async (req, res) => {
        
    var messages;

    // find a chat under logged in user with the given chatId
    await Message.find({ chat: req.params.chatId }
    , (err, chat) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            // set getChat to equal found chat
            messages = chat;
        }
    });

    if(!messages) {
        res.status(400).json({message: "no chat found under logged in user and chatId"});
    } else {
        res.status(200).json({success: true, messages});
    }
    
};