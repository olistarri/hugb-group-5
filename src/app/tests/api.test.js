// Modules from chaiHttp
let server = require('../dist/app');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const apiVersion = "/api/v1"
let apiUrl = "http://localhost:3000"

describe('Endpoint tests', () => {
    beforeEach((done) => {
        // server.resetState();
        done();
    });
    
    // GET User endpoint test -- DONE
    it("GET /users - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            // res.body.length.should.be.eql(4)
            done();
            });
    });

    it("GET one specific user - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users/6325d8ce4584f7a57192113b")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql("6325d8ce4584f7a57192113b");
            res.body.should.have.property('username').eql("Sindri");
            res.body.should.have.property('email').eql("sindri@sindri.is");
            res.body.should.have.property('name').eql("Sindri Thor");
            res.body.should.have.property('phone').eql("5812345");
            Object.keys(res.body).length.should.be.eql(5);
            done();
            });
    });

    // GET Appointment endpoint test
    it("GET /appointments - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/appointments")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            // res.body.length.should.be.eql(1);
            done();
            });
    });

    it("GET one specific appointment - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/appointments/6320cc9e74e18135acb030ef")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql("6320cc9e74e18135acb030ef");
            res.body.should.have.property('barberid').eql("6320cbb34f34a584a07ab6d6");
            res.body.should.have.property('date').eql("2022-11-01");
            res.body.should.have.property('time').eql("10:30");
            res.body.should.have.property('customer').eql('olistarri');
            Object.keys(res.body).length.should.be.eql(5);
            done();
            });
    });

    // GET Barber endpoint test
    it("GET /barbers - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/barbers")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            // res.body.length.should.be.eql(2)
            done();
            });
    });

    it("GET one specific barber - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/barbers/6320cbb34f34a584a07ab6d6")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql("6320cbb34f34a584a07ab6d6");
            res.body.should.have.property('username').eql("barber1");
            res.body.should.have.property('name').eql("Big Barber Boy");
            Object.keys(res.body).length.should.be.eql(3);
            done();
            });
    });

    it("GET /services - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/services")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            // res.body.length.should.be.eql(2)
            done();
            });
    });

    it("GET one specific service - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/services/6320cc9e74e18135acb030ef")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql("6320cbb34f34a584a07ab6d6");
            res.body.should.have.property('type').eql("barber1");
            res.body.should.have.property('name').eql("Barber Big Boy");
            Object.keys(res.body).length.should.be.eql(3);
            done();
            });
    });

    // it("DELETE one appointment - SUCCESS test", function (done) {
    //     chai.request(apiUrl)
    //         .delete(apiVersion + "/appointments/6320cc9e74e18135acb030ef")
    //         .end((err, res) => {
    //         res.should.have.status(200);
    //         res.should.be.json;
    //         done();
    //         });
    // });

    // it("DELETE one appointment - FAIL test", function (done) {
    //     chai.request(apiUrl)
    //         .delete(apiVersion + "/appointments/")
    //         .end((err, res) => {
    //         res.should.have.status(400);
    //         res.should.be.json;
    //         res.body.should.have.property('messages').eql("Invalid id");
    //         done();
    //         });
    // });
});