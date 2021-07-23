const express = require('express');
const session = require('express-session');

const app = express();
const port = 3001;

const mainController = require('./src/controllers/mainController');
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
}));

//~~~~~~~~~~~~~~~~ ROUTES ~~~~~~~~~~~~~~~~~~//
const loginRouter = require('./src/routes/loginRoute');
const registerRouter = require('./src/routes/registerRoute');
const chatRouter = require('./src/routes/chatRoute');
const messageRouter = require('./src/routes/messageRoute');
const tweetRouter = require('./src/routes/tweetRoute');

app.use('/login', loginRouter);
app.use('/register', registerRouter);
app.use('/chats', chatRouter);
app.use('/chats/:chatId/messages', mainController.requireLogin, messageRouter);
app.use('/tweets', mainController.requireLogin, tweetRouter);

//~~~~~~~~~~~~~~~~~~~~ ~~~~~~~~~~~~~~~~~~~~~//

app.get("/", mainController.requireLogin, (req, res, next) => {
    
    res.status(200).send(req.session.user);
});

module.exports = app;