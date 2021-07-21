const chai = require('chai');
const chaiHttp = require('chai-http');

const app = require('../../../index');

const expect = chai.expect;

chai.should();
chai.use(chaiHttp);

describe('Login Route Methods', () => {
    // Testing GET method for loginRoute
    describe('GET method: Should return \'You are at the Login Page\'', () => {
        it('It should be in json format.', (done) => {
            chai.request(app)
                .get('/login')
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body.status).to.equal('You are at the Login Page');
                    done();                  
                });
        });
    });

    // Testing POST method for loginRoute
    // Testing for a REGISTERED USER
    describe('POST, registered user login.', () => {
        it('Should be type json, with 3 elements, and successfully log in registered user', (done) => {
            const sample = {
                username: "jordan",
                password: "23"
            };
            chai.request(app)
                .post('/login')
                .send(sample)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(200);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').eq(true);
                    expect(res.body).to.have.property('username').eq('jordan');
                    expect(res.body).to.have.property('status').eq("Login Successful!");
                    done();                  
                });
        });
    });

    // Testing for a UNREGISTERED USER
    describe('POST, unregistered user login.', () => {
        it('Should be type json, with 3 elements, and unsuccessfully log in unregistered user', (done) => {
            const sample = {
                username: "mick",
                password: "000"
            };
            chai.request(app)
                .post('/login')
                .send(sample)
                .end((err, res) => {
                    expect(err).to.be.null;
                    expect(res).to.have.status(500);
                    expect(res).to.be.json;
                    expect(res.body).to.have.property('success').eq(false);
                    expect(res.body).to.have.property('username').eq('mick');
                    expect(res.body).to.have.property('message').eq(`\'${res.body.username}\' does not exist in database!`);
                    done();                  
                });
        });
    });

    // Testing for an empty password field
    describe('POST, empty password login.', () => {
        it('Should be type json, with 1 element, unsuccessful log in with message \'... fields cannot be empty!\'', (done) => {
            const sample = {
                username: "jordan",
                password: ""
            };
            chai.request(app)
                .post('/login')
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
    describe('POST, empty username login.', () => {
        it('Should be type json, with 2 elements, unsuccessful log in with message \'... fields cannot be empty\'', (done) => {
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
});