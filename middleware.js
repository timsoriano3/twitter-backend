const mongoose = require('mongoose');
const userSchema = require('./src/models/User');

const User = mongoose.model('User', userSchema);

exports.requireLogin = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    } else {
        return res.redirect('/login');
    }
};


// middleware for register .post methos
exports.registerUser = async (req, res) => {
    if (!req.body.username || !req.body.password) {
        return res.status(500).json({
            success: false,
            message: "Username and Password fields cannot be empty!"
        });
    }
    
    var newUser = new User(req.body);

    var user = await User.findOne({ username: req.body.username });

    if (user == null) {
        // if username doesnt already exist in db
        newUser.save((err, user) => {
            if (err) {
                res.status(500).json({ err: err });
            } else {
                req.session.user = user;
                res.status(200).json({
                    success: true,
                    username: user.username, 
                    status: 'Registration Successful!'
                });
            }
        });
    } else {
        // if requested username already exists in db
        res.status(500).json({
            success: false,
            username: req.body.username,
            message: "Username already exists!" 
        });
    }
};


// middlewar for login .post method
exports.loginUser = async (req, res) => {
    // Check if either username or password field is empty
    if (!req.body.username || !req.body.password) {
        return res.status(500).json({
            success: false,
            message: "Username and Password fields cannot be empty!"
        });
    }

    // Find a user with the given username
    var user = await User.findOne({ username: req.body.username });
    if (user != null){
        // If user found, then
        // Check to see if the password matches the user's password in the db
        if (req.body.password === user.password) {
            // If password matches
            req.session.user = user;
            return res.status(200).json({
                success: true, 
                username: user.username, 
                status: 'Login Successful!'
            });
        } else {
            // If password does not match
            return res.status(500).json({
                success: false,
                username: req.body.username,
                message: `Wrong password for ${req.body.username}`
            });
        }
    } else {
        // No user found with the given username
        return res.status(500).json({
            success: false,
            username: req.body.username,
            message: `\'${req.body.username}\' does not exist in database!`
        });
    }
};