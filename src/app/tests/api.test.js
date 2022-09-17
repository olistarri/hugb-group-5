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
var newBarberID = "";

var barberObjectSuccess = {
    username: "Sindri", // username þarf að vera það sama og af User
};

var barberObjectFail = {
    something:"Some other thing" // No username
};

var barberObjectFail1 = { // name already in use
    username: "barbie",
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
    barberid: "6325eb956aec9d26d37d7723", //id þarf að vera til
    date: "2022-11-02", //eitt test er fail þegar efstu 3 eru þegar í kerfinu saman
    time: "12:00",
    customer: "olistarri",  //þarf að vera til í User
};
var appointmentObjectFail = {  
    barberid: "asdf", // barber ekki til
    date: "2022-11-10", 
    time: "12:00",
    customer: "olistarri",
};
var appointmentObjectFail1 = {  
    barberid: "6325eb956aec9d26d37d7723", //þegar appointment með id date og time
    date: "2022-11-04", 
    time: "10:30",
    customer: "olistarri",  
};
var appointmentObjectFail2 = {  
    barberid: "6325eb956aec9d26d37d7723", 
    date: "2022-11-05", 
    time: "12:00",
    customer: "asdf",  // customer ekki í users username
};
var appointmentObjectFail3 = {
    date: "2022-11-06", 
    time: "12:00",
    customer: "olistarri",
};
var servicesObjectSuccess = {
    barberid: "123",   //id vitlaust
    date: "2022-11-07",
    time: "11:00",
    customer: "olistarri"  
};
var servicesObject1 = {
    barberid: "6325eb956aec9d26d37d7723",
    date: "2022-11-08",
    time: "11:00",
    customer: "123"  //ekki til
};

var servicesObjectSuccess2 = {
    barberid: "6325eb956aec9d26d37d7723", // 3 efstu þegar í appointments
    date: "2022-11-12",
    time: "10:30",
    customer: "olistarri"  
};
var servicesObjectSuccess2 = {
    barberid: "6325eb956aec9d26d37d7723", 
    date: "2022", // ekki rétt
    time: "10", // ekki rétt
    customer: "olistarri"  
};

describe('Endpoint tests', () => {
    beforeEach((done) => {
        // server.resetState();
        done();
    });

    // USER ENDPOINT TESTS //

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
            .get(apiVersion + "/users/" + newUserID)
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql(newUserID);
            res.body.should.have.property('username').eql("asdf");
            res.body.should.have.property('email').eql("asdf");
            res.body.should.have.property('name').eql("asdf");
            res.body.should.have.property('phone').eql("1234");
            Object.keys(res.body).length.should.be.eql(5);
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

    it("GET one specific user - FAIL", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users/" + newUserID)
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.should.have.property('message').eql("Invalid id")
            Object.keys(res.body).length.should.be.eql(5);
            done();
            });
    });

    // APPOINTMENT ENDPOINT TESTS //

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

    it("GET one specific appointment - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/appointments/" + newAppointmentID)
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql(newAppointmentID);
            res.body.should.have.property('barberid').eql("6325eb956aec9d26d37d7723");
            res.body.should.have.property('date').eql("2022-11-02");
            res.body.should.have.property('time').eql("12:00");
            res.body.should.have.property('customer').eql('olistarri');
            Object.keys(res.body).length.should.be.eql(5);
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


    // BARBER ENDPOINT TESTS //

    it("POST /barbers", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectSuccess))
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('insertedId');
                newBarberID = res.body.insertedId;
                done();
            });
    });

    it("POST /barbers again - failes", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectSuccess))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message').eql('This user is already a barber.');
                //res.body.message.should.be.eql('');
                //res.body.message.should.have.property()
                done();
            });
    });

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
            .get(apiVersion + "/barbers/" + newBarberID)
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('_id').eql(newBarberID);
            res.body.should.have.property('username').eql("barber1");
            res.body.should.have.property('name').eql("Big Barber Boy");
            Object.keys(res.body).length.should.be.eql(3);
            done();
            });
    });

    it("DELETE /barbers/:id", function (done) {
        chai.request(apiUrl)
            .delete(apiVersion + "/barbers/" + newBarberID)
            .end((err, res) => {
                res.should.have.status(200);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('acknowledged').eql(true);
                res.body.should.have.property('deletedCount').eql(1);
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
});