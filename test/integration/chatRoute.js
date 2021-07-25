const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../../index');

const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

// Integration testing for all chatRoute endpoints
// Starting by logging in a registered user

describe('Chat Route Methods', () => {
    
    
    const user = {
        username: "tim",
        password: "000001"
    }

    const otherUser = {
        username: "lebron",
        password: "23"
    }

    var otherUserLogin = request.agent(app);
    var userLogin = request.agent(app);

    beforeEach((done) => {
        userLogin
            .post('/login')
            .send(user)
            .end((err, res) => {
                if (err) {
                    throw err;
                } 
                expect(res).to.have.status(200);
                done();
            });
    });

    before((done) => {
        otherUserLogin
            .post('/login')
            .send(otherUser)
            .end((err, res) => {
                if (err) {
                    throw err;
                } 
                expect(res).to.have.status(200);
                done();
            });
    });




    // Testing GET method for chatRoute
    // Testing if we can retrieve all the chats that the logged in user is a part of
    describe('GET, all chats that involves logged in user.', () => {
    
        it('Should be type json, with 2 elements, and successfully retrieve' + 
        ' all chats that involve the logged in user, should return \'success\'' + 
        ' under message response field', (done) => {
            chai.request(app)
                userLogin
                .get('/chats')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('success');
                    expect(res.body).to.have.property('chats');
                    done();
                });
        });
    });

    // Testing POST method for chatRoute
    // Testing if we can create a new chat with 2 users, and more than 2 users
    describe('POST, creates new chat with given users', () => {

        it('Should be type json, with 4 elements, and successfully log in registered user, returns session info', (done) => {
            const chat = {
                chatTitle: 'Group Chat',
                users: [
                    {
                        username: "tat",
                        password: "000001"
                    },
                    {
                        username: "brigit",
                        password: "000001"
                    },
                    {
                        username: "jason",
                        password: "111"
                    }

                ]
            };
            chai.request(app)
                userLogin
                .post('/chats')
                .send(chat)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').to.be.true;
                    expect(res.body).to.have.property('chat');
                    expect(res.body).to.have.property('isGroup').to.be.true;
                    expect(res.body).to.have.property('status').eq('chat created!');
                    done();
                });
        });
    });


    // Testing GET method for chatRoute ('/:chatId')
    // Testing if we can retrieve a chat by its ID and output its chat data
    describe('GET, the specified chat by its ID and display its chat data', () => {
        
        // test to get chat by id where logged in user is part of chat
        it('Should be type json, with 2 elements, and successfully retrieve' + 
        ' the specified chat that involves the logged in user, should return \'true\'' + 
        ' under success response field', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */
           
            chai.request(app)
                userLogin
                .get('/chats/' + chatId)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').to.be.true;
                    expect(res.body).to.have.property('chat');
                    done();
                });
        });

        // test to get chat by id where logged in user is NOT part of chat
        it('Should be type json, with 1 element, and unsuccessfully retrieve' + 
        ' the specified chat, should return unsuccessful message since logged ' +
        'user is not part of the chat', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */
           
            chai.request(app)
                otherUserLogin
                .get('/chats/' + chatId)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('Chat not found!');
                    done();
                });
        });

    });




    // Testing PUT method for chatRoute ('/:chatID')
    // Testing if we can update the chat title of the specified chat by id
    describe('PUT, updating chatTitle of specified chat', () => {
    
        it('Should be type json, with 2 elements, and successfully update' + 
        ' the chatTitle of specified chat by id, should return a message saying ' + 
        ' the chatTitle is updated with the following new title', (done) => {
            
            var chatTitle = "Test Chat";
            var chatId = '60fc5a095b994d611b220a57';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fb24c7b83e172b2b965157
            60fc15c67aa17923fe2d7b7a
            */
           
            chai.request(app)
                userLogin
                .put('/chats/' + chatId)
                .send({chatTitle: chatTitle})
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('chatId').eq(chatId);
                    expect(res.body).to.have.property('message').eq(`Chat name updated to '${chatTitle}'`);
                    done();
                });
        });
    });
});


