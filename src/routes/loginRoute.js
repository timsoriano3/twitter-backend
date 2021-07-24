const express = require('express');

// middleware for logging in user from mainController.js
const { loginUser } = require('../controllers/mainController');

const app = express();
const loginRouter = express.Router();

// body-parser
app.use(express.json());


loginRouter.route('/')
    .get((req, res, next) => { 
        res.status(200).json({status: "You are at the Login Page"});
    })

    // User Login
    .post((req, res, next) => {

        console.log("User login attempt");
        next();
    }, 
    loginUser
    );

module.exports = loginRouter;