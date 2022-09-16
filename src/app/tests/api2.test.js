// Modules from chaiHttp
let server = require('../dist/app');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const apiVersion = "/api/v1"
let apiUrl = "http://localhost:3000"

var barberObjectSuccess = {
    name: "ónotað",
    username: "Sindri", // username þarf að vera það sama og af User
   // name: "ónotað",
};
var barberObjectFail = { // username already in use
    username: "barber1",
    name: "ónotað",
};
var barberObjectFail1 = { // name already in use
    username: "barbie",
    name: "Big Barber Boy",
};

var userObjectSuccess = {
    name: "asdf",
    username: "asdf", //eina með if setningu
    email: "asdf",
    password: "sindri12",
    phone: "1234",
};
var userObjectFail = {
    name: "asdf",
    username: "olistarri", //usernamer þegar til
    email: "asdf",
    password: "sindri12",
    phone: "asdf",
};
var userObjectFail1 = {
    name: "",       //no name
    username: "asdf", 
    email: "asdf",
    password: "asdf",
    phone: "asdf",
};
var userObjectFail2 = {
    name: "",           // gera fail fyrir hvern reit tóman?
    username: "", 
    email: "",
    password: "",
    phone: "",
};


var appointmentObjectSuccess = {  
    barberid: "6320cbb34f34a584a07ab6d6", //id þarf að vera til
    date: "2022-11-02", //eitt test er fail þegar efstu 3 eru þegar í kerfinu saman
    time: "12:00",
    customer: "olistarri",  //þarf að vera til í User
};
var appointmentObjectFail = {  
    barberid: "asdf", // barber ekki til
    date: "2022-11-02", 
    time: "12:00",
    customer: "olistarri",
};
var appointmentObjectFail1 = {  
    barberid: "6320cbb34f34a584a07ab6d6", //þegar appointment með id date og time
    date: "2022-11-01", 
    time: "10:30",
    customer: "olistarri",  
};
var appointmentObjectFail2 = {  
    barberid: "6320cbb34f34a584a07ab6d6", 
    date: "2022-11-02", 
    time: "12:00",
    customer: "asdf",  // customer ekki í users username
};
var servicesObjectSuccess = {
    barberid: "123",   //id vitlaust
    date: "2022-11-01",
    time: "11:00",
    customer: "olistarri"  
};
var servicesObject1 = {
    barberid: "6320cbb34f34a584a07ab6d6",
    date: "2022-11-01",
    time: "11:00",
    customer: "123"  //ekki til
};

var servicesObjectSuccess2 = {
    barberid: "6320cbb34f34a584a07ab6d6", // 3 efstu þegar í appointments
    date: "2022-11-01",
    time: "10:30",
    customer: "olistarri"  
};
var servicesObjectSuccess2 = {
    barberid: "6320cbb34f34a584a07ab6d6", 
    date: "2022", // ekki rétt
    time: "10", // ekki rétt
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
            //.set("Content-type", "application/json")
            .send({userObjectSuccess})
            .end((err, res) => {
                res.should.have.status(200);
                //res.should.be.json;
                //res.body.should.be.a('array');
                done();
            });
    });
    it("POST /users username already exists fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            //.set("Content-type", "application/json")
            .send({userObjectFail})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                done();
            });
    });
    it("POST /users no name fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            //.set("Content-type", "application/json")
            .send({userObjectFail1})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                done();
            });
    });
    it("POST /users no body fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            //.set("Content-type", "application/json")
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                done();
            });
    });


    it("POST /appointments", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            //.set("Content-type", "application/json")
            .send({appointmentObjectSuccess})
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                //res.body.should.be.a('array');
                done();
            });
    });
    it("POST /appointments no body fail", function (done) { 
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            //.set("Content-type", "application/json")
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                done();
            });
    });
    it("POST /appointments barber id fail ", function (done) { // Enginn með þetta barber ID
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            //.set("Content-type", "application/json")
            .send({appointmentObjectFail})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                done();
            });
    });
    it("POST /appointments appointment at same time fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            //.set("Content-type", "application/json")
            .send({appointmentObjectFail1})
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                //res.body.should.be.a('array');
                done();
            });
    });
    it("POST /appointments customers username doesn't exist fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            //.set("Content-type", "application/json")
            .send({appointmentObjectFail2})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                done();
            });
    });

    it("POST /barbers", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send({barberObjectSuccess})
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('array');
                done();
            });
    });
    it("POST /barbers no body fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            //.set("Content-type", "application/json")
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                done();
            });
    });
    it("POST /barbers username fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            //.set("Content-type", "application/json")
            .send({barberObjectFail})
            .end((err, res) => {
                res.should.have.status(400);
               // res.should.be.json;
                //res.body.should.have.property('message').eql("barber already exists.");
                done();
            });
    });
    it("POST /barbers name fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            //.set("Content-type", "application/json")
            .send({barberObjectFail1})
            .end((err, res) => {
                res.should.have.status(400);
                //res.should.be.json;
                //res.body.should.have.property('message').eql("barber already exists.");
                done();
            });
    });
});