const express = require('express');

// middleware for .post for loging in user
const { loginUser } = require('../../middleware');

const app = express();
const router = express.Router();


// body-parser
app.use(express.json());

router.get("/", (req, res, next) => { 
    res.status(200).json({status: "You are at the Login Page"});
});

router.post("/", async (req, res, next) => {

    console.log("User login attempt");
    next();
}, loginUser
);

module.exports = router;