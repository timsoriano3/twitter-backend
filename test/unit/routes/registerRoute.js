const chai = require('chai');
const chaiHttp = require('chai-http');
const crypto = require('crypto');

const app = require('../../../index');

const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe('Register Route Methods', () => {
    // Testing GET method for registerRoute
    describe('GET method: Should return \'You are at the Register Page\'!', () => {
        it('It should be in json format, should return \'You are at the Register Page!\'', (done) => {
            chai.request(app)
                .get('/register')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.status).to.equal('You are at the Register Page!');
                    done();                  
                });
        });
    });

    // Testing POST method for registerRoute
    // Testing for a REGISTERED USER
    describe('POST, registered user registration.', () => {
        it('Should be type json, with 3 elements, and unsuccessfully register an already registered user', (done) => {
            const sample = {
                username: "jordan",
                password: "23"
            };
            chai.request(app)
                .post('/register')
                .send(sample)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').eq(false);
                    expect(res.body).to.have.property('username').eq('jordan');
                    expect(res.body).to.have.property('message').eq("Username already exists!");
                    done();                  
                });
        });
    });

    // Testing for an UNREGISTERED USER
    describe('POST, unregistered user registration.', () => {
        it('Should be type json, with 4 elements, and successfully register unregistered user, returns session info', (done) => {
            
            // Generates a new unique string of letters and digits
            // Passes on to variable name to be used as new username for registration
            var name = crypto.randomBytes(20).toString('hex');

            const sample = {
                username: name,
                password: "111"
            };
            chai.request(app)
                .post('/register')
                .send(sample)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(201);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').eq(true);
                    expect(res.body).to.have.property('username').eq(name);
                    expect(res.body).to.have.property('status').eq("Registration Successful!");
                    expect(res.body).to.have.property('session');
                    done();                  
                });
        });
    });

    // Testing for an empty password field
    describe('POST, empty password registration', () => {
        it('Should be type json, with 2 element, unsuccessful registration with message \'... fields cannot be empty!\'', (done) => {
            const sample = {
                username: "jordan",
                password: ""
            };
            chai.request(app)
                .post('/register')
                .send(sample)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').eq(false);
                    expect(res.body).to.have.property('message').eq("Username and Password fields cannot be empty!");
                    done();                  
                });
        });
    });

    // Testing for an empty username field
    describe('POST, empty username registration.', () => {
        it('Should be type json, with 2 elements, unsuccessful registration with message \'... fields cannot be empty!\'', (done) => {
            const sample = {
                username: "",
                password: "23"
            };
            chai.request(app)
                .post('/login')
                .send(sample)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').eq(false);
                    expect(res.body).to.have.property('message').eq('Username and Password fields cannot be empty!');
                    done();                  
                });
        });
    });
    // Testing POST method
});