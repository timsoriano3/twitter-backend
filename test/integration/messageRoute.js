const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../../index');

const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

// Integration testing for all messageRoute endpoints
// Starting by logging in a registered user

describe('Message Route Methods', () => {
    
    
    const user = {
        username: "tim",
        password: "000001"
    }

    const otherUser = {
        username: "lebron",
        password: "23"
    }

    var userLogin = request.agent(app);
    var otherUserLogin = request.agent(app);

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




    // Testing GET method for messageRoute
    // Testing if we can retrieve all the messages in a chat for which,
    // the logged in user is a part of
    describe('GET, all chat messages that involves logged in user.', () => {
    
        it('Should be type json, with 2 elements, and successfully retrieve' + 
        ' all chat messages if the logged in user is part of the chat, should return ' + 
        ' \'success\' under message response field', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */
            
            chai.request(app)
                userLogin
                .get('/chats/' + chatId + '/messages')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('Success');
                    expect(res.body).to.have.property('chat_messages');
                    done();
                });
        });


        it('Should be type json, with 1 element, and unsuccessfully retrieve' + 
        ' chat messages because the logged in user is not part of the chat, should return ' + 
        ' \'success\' under message response field', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */
            
            chai.request(app)
                otherUserLogin
                .get('/chats/' + chatId  + '/messages')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('You are unauthorized to view this chat');
                    done();
                });
        });
    });




    // Testing POST method for messageRoute
    // Testing if we can post a messages in a chat for which,
    // the logged in user is a part of
    describe('POST, all chat messages that involves logged in user.', () => {
    
        it('Should be type json, with 2 elements, and successfully send' + 
        ' a messages to specified chat if the logged in user is part of the chat, ' +
        ' should return \'message sent\' under status response field', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */
            
            var message = {
                content: "Test message"
            };

            chai.request(app)
                userLogin
                .post('/chats/' + chatId + '/messages')
                .send(message)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status').eq('Message sent');
                    expect(res.body).to.have.property('message');
                    done();
                });
        });



        it('Should be type json, with 1 element, and unsuccessfully send chat ' + 
        'message because the logged in user is not part of the chat, should return ' + 
        'unauthorized message', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */

            var message = {
                content: ""
            };
            
            chai.request(app)
                userLogin
                .post('/chats/' + chatId  + '/messages')
                .send(message)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(400);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('Content must not be empty!');
                    done();
                });
        });



        it('Should be type json, with 1 element, and unsuccessfully send chat ' + 
        'message because the logged in user is not part of the chat, should return ' + 
        'unauthorized message', (done) => {
            
            var chatId = '60fc15c67aa17923fe2d7b7a';
            /* 
            other chatId's:
            60fb25cbb519db2c25567ebb
            60fc5a095b994d611b220a57
            60fb24c7b83e172b2b965157
            */

            var message = {
                content: "Test message"
            };
            
            chai.request(app)
                otherUserLogin
                .post('/chats/' + chatId  + '/messages')
                .send(message)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('You are unauthorized to view this chat');
                    done();
                });
        });
    });
});
