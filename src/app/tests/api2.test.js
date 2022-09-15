// Modules from chaiHttp
let server = require('../dist/app');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const apiVersion = "/api/v1"
let apiUrl = "http://localhost:3000"

var barberObjectSuccess = {
    username: "barbie",
};
var barberObjectFail = {
    _id: "6320cbb34f34a584a07ab6d2",
    username: "",
    name: "Gregory",
};
var userObjectSuccess = {
    name: "",
    username: "Sindri",
    emai: "",
    password: "sindri12",
    phone: "",
};
var userObjectFail = {
    _id: "66320b455e9fbd820b1325bbd",
    username: "Success Barber",
    password: "banjo",
    type: "customer",
};
var appointmentObjectSuccess = {
    _id: "66320cc9e74e18135acb030ef",
    barberid: "16320cbb34f34a584a07ab6d6",
    date: "2022-11-01",
    time: "10:30",
    customer: "olistarri"  
};
var servicesObjectSuccess = {
    _id: "66320b455e9fbd820b1325bbd",
    barberid: "1320cbb34f34a584a07ab6d6",
    date: "2022-11-01",
    time: "11:00",
    customer: "olistarri"  
};



describe('Endpoint tests', () => {
    //###########################
    //The beforeEach function makes sure that before each test, 
    //there are exactly two tunes and two genres.
    //###########################
    beforeEach((done) => {
        //server.resetState();
        done();
    });
    it("POST /users", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .send({userObjectSuccess})
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
            .send({appointmentObjectSuccess})
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
            .send({barberObjectSuccess})
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.be.a('array');
            done();
            });
    });
});