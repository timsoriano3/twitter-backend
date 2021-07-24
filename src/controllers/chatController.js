const mongoose = require('mongoose');
const Chat = require('../models/Chat');

const userSchema = require('../models/User');
const User = mongoose.model('User', userSchema);


// middleware for chatRoute .post method
exports.chatPost = async (req, res) => {
    
    // function to create new chat
    const createNewChat = (users, isGroup) => {
        const newChat = {
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
        if(!req.body.users) {
            console.log("Users param not sent with request");
            return res.status(400).json({message: "must inclode users param"});
        }
    
        if(req.body.users.length == 0) {
            console.log("users array is empty");
            return res.status(400).json({message: "Users array must not be empty"});
        }
    
        req.body.users.push(req.session.user);
    
        const users = [];
        var isGroup = (req.body.users.length > 2) ? true: false;
        const usersData = req.body.users;
    
        usersData.forEach( async (reqUsers) => {
            // check if users in request body are registered users in the database
            const user = await User.findOne({username: reqUsers.username});
    
            // if reqUsers are registered users,
            // then add chat user to users array, adding the username for better display
            if(user)  users.push(user.username);
    
            // only when # of users in the array are equal to the # users in request body
            // then we create the chat
            if(users.length === usersData.length) createNewChat(users, isGroup);
        });            
    } catch (err) {
        if (err) {
            res.status(500).json({err: err});
        }
    }
};


// middleware for chatRoute .get method
exports.chatGet = async (req, res) => {
        
    const chats = [];

    // find all chats under logged in user
    await Chat.find({ users: { $elemMatch: { $eq: req.session.user.username } } }
    , (err, chat) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            // push all chats under logged in user to chats array
            chats.push(chat);
        }
    });

    if(!chats) {
        res.status(400).json({message: "no chat found under logged in user"});
    } else {
        res.status(200).json({success: true, chats});
    }
};


// middleware for chatRoute /:chatId .put method
exports.chatIdPut = async (req, res) => {
    var chatTitle = req.body.chatTitle;

    Chat.findByIdAndUpdate(req.params.chatId, chatTitle
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
exports.chatIdGet = async (req, res) => {
        
    var getChat;

    // find a chat under logged in user with the given chatId
    await Chat.findOne({ 
        _id: req.params.chatId, 
        users: { $elemMatch: { $eq: req.session.user.username } } 
    }
    , (err, chat) => {
        if (err) {
            res.status(400).json({err: err});
        } else {
            // set getChat to equal found chat
            getChat = chat;
        }
    });

    if(!getChat) {
        res.status(400).json({message: "no chat found under logged in user and chatId"});
    } else {
        res.status(200).json({success: true, chat: getChat});
    }
    
};


