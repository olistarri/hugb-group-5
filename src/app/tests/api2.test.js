// Modules from chaiHttp
let server = require('../dist/app');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const apiVersion = "/api/v1"
let apiUrl = "http://localhost:3000"

var newUserID = "";
var newAppointmentID = "";

var barberObjectSuccess = {
    username: "Sindri", // username þarf að vera það sama og af User
    name: "ónotað",
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
    name: "asdf",       //no name
    username: "", 
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
var appointmentObjectFail3 = {  
    barberid: "", 
    date: "2022-11-02", 
    time: "12:00",
    customer: "olistarri",
}
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
    beforeEach((done) => {
        //server.resetState();
        done();
    });
    it("POST /users", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .set("Content-type", "application/json")
            .send(JSON.stringify(userObjectSuccess))
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('insertedId');
                newUserID = res.body.insertedId;
                done();
            });
    });
    it("POST /users username already exists fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .set("Content-type", "application/json")
            .send(JSON.stringify(userObjectSuccess))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql('No user with this username.');
                res.body.message.should.be.eql('Username already exists.')
                
                done();
            });
    });
    it("DELETE /users success", function (done) {
        chai.request(apiUrl)
            .delete(apiVersion + "/users/" + newUserID)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('deletedCount').eql(1);
                done();
            });
    })

    it("DELETE /users no deletion", function (done) {
        chai.request(apiUrl)
            .delete(apiVersion + "/users/" + newUserID)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('deletedCount').eql(0);
                done();
            });
    })
    it("POST /users no name fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .set("Content-type", "application/json")
            .send(JSON.stringify(userObjectFail1))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Bad request. Request needs to contain name, username, email, password and phone, cannot be empty.')
                done();
            });
    });
    it("POST /users no body fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .set("Content-type", "application/json")
            .send({}) // oviss
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Invalid body')
                done();
            });
    });


    it("POST /appointments", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectSuccess))
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('insertedId');
                newAppointmentID = res.body.insertedId;
                done();
            });
    });

    it("DELETE /appointments/:id", function (done) {
        chai.request(apiUrl)
            .delete(apiVersion + "/appointments/" + newAppointmentID)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('deletedCount').eql(1);
                done();
            });
    })

    it("POST /appointments no body fail", function (done) { 
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send({})
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Invalid body');
                done();
            });
    });
    it("POST /appointments barber id fail ", function (done) { // Enginn með þetta barber ID
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('barber does not exist.');
                done();
            });
    });
    it("POST /appointments appointment at same time fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail1))
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('barber already has an appointment at this date/time.');
                done();
            });
    });
    it("POST /appointments customers username doesn't exist fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail2))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('customer does not exist.');
                done();
            });
    });
    it("POST /appointments empty barber id fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail3))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Bad request. Request needs to contain barber, date, time and customer.');
                done();
            });
    });

    it("POST /barbers", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectSuccess))
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                //res.body.should.have.property('message');
                //res.body.message.should.be.eql('');
                //res.body.message.should.have.property()
                done();
            });
    });
    it("POST /barbers no body fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            //.set("Content-type", "application/json")
            .send(null)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql('Invalid body');
                res.body.message.should.be.eql("Invalid body")
                done();
            });
    });
    it("POST /barbers username fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectFail))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
               res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql("barber already exists.");
                //res.body.message.should.be.eql("barber already exists.");
                res.body.message.should.be.eql("Bad request. Request needs to contain a username.")
                done();
            });
    });
    it("POST /barbers name fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            //.set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectFail1))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                //res.body.message.should.be.eql("No user with this username.")
                res.body.message.should.be.eql('Bad request. Request needs to contain a username.')
                done();
            });
    });
});