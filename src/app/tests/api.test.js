// Modules from chaiHttp
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const apiVersion = "/api/v1"
let apiUrl = "http://localhost:3000"

describe('Endpoint tests', () => {
    //###########################
    //The beforeEach function makes sure that before each test, 
    //there are exactly two tunes and two genres.
    //###########################
    beforeEach((done) => {
        server.resetState();
        done();
    });
    
    // GET User endpoint test
    it("GET /users", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });

    // GET Appointment endpoint test
    it("GET /appointments", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "api/appointments")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });

    // GET Barber endpoint test
    it("GET /barbers", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "api/barbers")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });

    it("POST /users", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });


    it("POST /appointments", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "api/appointments")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });

    it("POST /barbers", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "api/barbers")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });
});