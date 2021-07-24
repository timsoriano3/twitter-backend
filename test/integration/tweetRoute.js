const chai = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');

const app = require('../../index');

const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

// Integration testing for all tweetRoute endpoints
// Starting by logging in a registered user

describe('Tweet Route Methods', () => {
    
    // variable to store tweet that will be posted
    // further down the page this same tweet will be deleted by the delete test
    // this in order to run the tests consistently without having to change code
    var toBeDeletedTweetId;
    
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

    before((done) => {
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




    // Testing GET method for tweetRoute
    // Testing if we can retrieve all posted tweets,
    describe('GET, all tweets posted by any user', () => {
    
        it('Should be type json, with 2 elements, and successfully retrieve' + 
        ' all posted tweets by any user and should return message of' + 
        ' \'Successfully retrieved all tweets\' under status response field', (done) => {
            
            chai.request(app)
                userLogin
                .get('/tweets')
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status').eq('Successfully retrieved all tweets');
                    expect(res.body).to.have.property('tweet');
                    done();
                });
        });
    });




    
    
    // Testing POST method for tweetRoute
    // Testing if we can post a tweet,
    describe('POST, a tweet', () => {
    
        it('Should be type json, with 2 elements, and successfully post' + 
        ' tweet, should return \'Tweet Posted Successfully!\' under status field', (done) => {
            
            var tweet = {
                content: "Test tweet"
            };

            chai.request(app)
                userLogin
                .post('/tweets')
                .send(tweet)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status').eq('Tweet Posted Successfully!');
                    expect(res.body).to.have.property('tweet');
                    toBeDeletedTweetId = res.body.tweet._id;
                    done();
                });
        });


        it('Should be type json, with 1 element, and unsuccessfully post' + 
        ' tweet, should return \'Content must not be empty!\' under message field', (done) => {
            
            var tweet = {
                content: ""
            };

            chai.request(app)
                userLogin
                .post('/tweets')
                .send(tweet)
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
    });



    
    
    
    // Testing GET method for tweetRoute ('/:tweetId')
    // Testing if we can get tweet by its id,
    describe('GET, a tweet by its ID', () => {
    
        it('Should be type json, with 2 elements, and successfully get the tweet ' + 
        'by its id, should return message containin both the tweet Id and who posted the tweet', (done) => {
            
            var tweetId = '60fb340020d1bd397be78927';
            /*
            other tweet id's:
            60fb24190959502a8f787852
            60fb346e20d1bd397be78931
            60fb347820d1bd397be78933
            60fc1d5c8243ce2bbee93ae3
            */

            chai.request(app)
                userLogin
                .get('/tweets/' + tweetId)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status').eq(`Successfully retrieved tweet with id: ${tweetId}, tweeted by: ${res.body.tweet.tweetedBy}`);
                    expect(res.body).to.have.property('tweet');
                    done();
                });
        });  
        
        
        it('Should be type json, and unsuccessfully get the tweet by its id, ' + 
        'should return error message because tweet id does not exist', (done) => {
            
            var tweetId = '23fb340020d1bd397be75678';
            /*
            other tweet id's:
            60fb24190959502a8f787852
            60fb346e20d1bd397be78931
            60fb347820d1bd397be78933
            60fc1d5c8243ce2bbee93ae3
            */

            chai.request(app)
                userLogin
                .get('/tweets/' + tweetId)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(404);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('Tweet not found!');
                    done();
                });
        });  
    });



    
    
    
    // Testing PUT method for tweetRoute ('/:tweetId')
    // Testing if we can update the content of a tweet by its id,
    describe('PUT, a tweet by its ID', () => {
    
        it('Should be type json, with 3 elements, and successfully update the tweet content ' + 
        'by its id, and should return message containing both the tweet Id and who posted the tweet', (done) => {
            
            var content = {
                content: "Testing tweet update"
            }

            var tweetId = '60fc68a3c8e0a06f73c0e20e';
            /*
            other tweet id's:
            60fb24190959502a8f787852
            60fb346e20d1bd397be78931
            60fb347820d1bd397be78933
            60fc1d5c8243ce2bbee93ae3
            */

            chai.request(app)
                userLogin
                .put('/tweets/' + tweetId)
                .send(content)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status');
                    expect(res.body).to.have.property('new_tweet_content').eq(content.content);
                    expect(res.body).to.have.property('newTweet');                    
                    done();
                });
        });  
        
        

        
        
        it('Should be type json, and unsuccessfully update the tweet with specified, ' + 
        'ID, should return error message because logged in user is unauthorized to ' +
        'update the spexified tweet', (done) => {
            
            var content = {
                content: "Testing tweet update"
            }

            var tweetId = '23fb340020d1bd397be75678';
            /*
            other tweet id's:
            60fb24190959502a8f787852
            60fb346e20d1bd397be78931
            60fb347820d1bd397be78933
            60fc1d5c8243ce2bbee93ae3
            */

            chai.request(app)
                otherUserLogin
                .put('/tweets/' + tweetId)
                .send(content)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('You are unauthorized to update this tweet!');
                    done();
                });
        });  
    });




    // Testing DELETE method for tweetRoute ('/:tweetId')
    // Testing if we can delete the tweet by its id,
    describe('DELETE, a tweet by its ID', () => {
    
        it('Should be type json, with 2 elements, and successfully delete the tweet if ' + 
        'the logged in user attempting to delete the tweet is the one who posted the tweet', (done) => {
            
            var tweetId = toBeDeletedTweetId;
            /*
            other tweet id's:
            60fb24190959502a8f787852
            60fb346e20d1bd397be78931
            60fb347820d1bd397be78933
            60fc1d5c8243ce2bbee93ae3
            */

            chai.request(app)
                userLogin
                .delete('/tweets/' + tweetId)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('status').eq('Tweet successfully deleted!');
                    expect(res.body).to.have.property('deleted_Tweet');                    
                    done();
                });
        });  
        
        

        it('Should be type json, and unsuccessfully delete the tweet with specified, ' + 
        'ID, should return error message because logged in user is unauthorized to ' +
        'delete the tweet because they did not post the tweet', (done) => {
            
            var tweetId = toBeDeletedTweetId;
            /*
            other tweet id's:
            60fb24190959502a8f787852
            60fb346e20d1bd397be78931
            60fb347820d1bd397be78933
            60fc1d5c8243ce2bbee93ae3
            */

            chai.request(app)
                otherUserLogin
                .delete('/tweets/' + tweetId)
                .end((err, res) => {
                    if (err) {
                        console.log(err);
                    }
                    expect(err).to.be.null;
                    expect(res).to.have.status(401);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('message').eq('You are unauthorized to delete this tweet!');
                    done();
                });
        });  
    });
});
