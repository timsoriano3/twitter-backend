const express = require('express');
const session = require('express-session');

const app = express();
const port = 3001;

const middleware = require('./middleware');
const mongoose = require('./database');
const { SECRET_KEY } = require('./config');

const server = app.listen(port, () => 
    console.log("Server listening on port " + port)
);

// body-parser
app.use(express.json());

// express session
app.use(session({
    secret: SECRET_KEY,
    resave: true,
    saveUninitialized: false
}))

//~~~~~~~~~~~~~~~~ ROUTES ~~~~~~~~~~~~~~~~~~//
const loginRoute = require('./src/routes/loginRoute');
const registerRoute = require('./src/routes/registerRoute');

app.use('/login', loginRoute);
app.use('/register', registerRoute);

//~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~~~~~~~//

app.get("/", middleware.requireLogin, (req, res, next) => {
    
    res.status(200).send(req.session.user);
});

module.exports = app;