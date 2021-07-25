const mongoose = require('mongoose');
const Chat = require('../models/Chat');

const userSchema = require('../models/User');
const User = mongoose.model('User', userSchema);


// middleware for chatRoute .post method
// function to create new chat
exports.chatPost = async (req, res) => {
    
    // nested function to create new chat
    const createNewChat = (users, isGroup) => {
        const newChat = {
            chatTitle: req.body.chatTitle,
            users,
            isGroup
        };
        
        Chat.create(newChat, 
        (err, chat) => {
            if (err) {
                res.status(500).json({ err: err });
            } else {
                return res.status(201).json({
                    success: true,
                    chat: chat,
                    isGroup: isGroup,
                    status: "chat created!"
                });
            }
        });
    
    }

    try {
        // check if users field in request is empty, or no users provided in users field
        if(!req.body.users || req.body.users.length == 0) {
            console.log("Users param not sent with request");
            return res.status(400).json({message: "must inclode users param"});
        }
    
        // Add logged in user to the users array in request
        req.body.users.push(req.session.user);
    
        const users = [];
        // Check how many users were provided in request
        // If more than 2, set isGroup field to true, false otherwise
        var isGroup = (req.body.users.length > 2) ? true: false;
        const usersData = req.body.users;
    
        usersData.forEach( async (reqUsers) => {
            // check if users in request body are registered users in the database
            const user = await User.findOne({username: reqUsers.username});
    
            // if reqUsers are registered users,
            // then add usernames of chat users to users array
            if(user)  users.push(user.username);
    
            // only when # of users in the array are equal to the # users in request body
            // then we create the chat with parameters users and isGroup
            if(users.length === usersData.length) createNewChat(users, isGroup);
        });            
    } catch (err) {
        if (err) {
            res.status(500).json({err: err});
        }
    }
};


// middleware for chatRoute .get method
// function to get all chats that the logged in user is a part of
exports.chatGet = (req, res) => {
    Chat.find({ users: { $elemMatch: { $eq: req.session.user.username }}}
        , (err, chats) => {
            if (err) {
                res.status(400).json({err: err});
            } else {
                res.status(200).json({
                    message: "success",
                    chats: chats
                });
            }
        });
};


// middleware for chatRoute /:chatId .put method
// function to update the title of specified chat
exports.chatIdPut = async (req, res) => {
    var chatTitle = req.body.chatTitle;

    Chat.findByIdAndUpdate(req.params.chatId, {$set: {chatTitle: chatTitle}}, {new: true}
    , (err, result) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            res.status(200).json({
                chatId: req.params.chatId, 
                message: `Chat name updated to '${chatTitle}'`
            });
        }
    });
    
};



// middleware for chatRoute /:chatId .get method
// function to get the chat data of specified chat
exports.chatIdGet = async (req, res) => {
     
    try {
        
        // find a chat under logged in user with the given chatId
        const chat = await Chat.findOne({ 
            _id: req.params.chatId, 
            users: { $elemMatch: { $eq: req.session.user.username } } 
        });

        if (!chat) {
            return res.status(404).json({message: "Chat not found!"});
        }

        res.status(200).json({success: true, chat: chat});

    } catch (err) {
        if (err) {
            res.status(400).json({err: err});
        }
    }
    
};


