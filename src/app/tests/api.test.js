// Modules from chaiHttp
let server = require('../dist/app');
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
        // server.resetState();
        done();
    });
    
    // GET User endpoint test
    it("GET endpoint test for /users", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            res.body.length.should.be.eql(4)
            done();
            });
    });

    it("GET endpoint test for one user", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users/6320b455e9fbd820b1325bbd")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql("6320b455e9fbd820b1325bbd");
            res.body.should.have.property('username').eql("Sindri");
            res.body.should.have.property('password').eql("sindri12");
            res.body.should.have.property('type').a('customer');
            Object.keys(res.body).length.should.be.eql(4);
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
            res.body.length.should.be.eql(5)
            done();
            });
    });

    it("GET one specific appointment", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "api/appointments/6320cc9e74e18135acb030ef")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql("6320cc9e74e18135acb030ef");
            res.body.should.have.property('barberid').eql("6320cbb34f34a584a07ab6d6");
            res.body.should.have.property('date').eql("2022-11-01");
            res.body.should.have.property('customer').a('olistarri');
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
            res.body.length.should.be.eql(2)
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