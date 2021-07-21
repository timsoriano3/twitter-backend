const express = require('express');
const mongoose = require('mongoose');

// middleware for .post for registering new user
const { registerUser } = require('../../middleware');

const app = express();
const router = express.Router();


// body-parser
app.use(express.json());

router.get("/", (req, res, next) => {
    res.status(200).json({status: "You are at the Register Page!"});
});

router.post("/", (req, res, next) => {

    console.log('Attempt to register user.');
    next();
    }, 
    registerUser
);

module.exports = router;