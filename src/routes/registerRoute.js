const express = require('express');

// middleware for .post for registering new user
const { registerUser } = require('../controllers/mainController');

const app = express();
const registerRouter = express.Router();


// body-parser
app.use(express.json());


registerRouter.route('/')
    .get((req, res, next) => {
        res.status(200).json({status: "You are at the Register Page!"});
    })

    .post((req, res, next) => {

        console.log('Attempt to register user.');
        next();
    }, 
        registerUser
    );

module.exports = registerRouter;