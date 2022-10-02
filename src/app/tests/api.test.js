// Modules from chaiHttp
let server = require('../dist/app');
let chai = require('chai');
let should = chai.should();
let chaiHttp = require('chai-http');
chai.use(chaiHttp);
const apiVersion = "/api/v1"
let apiUrl = "http://localhost:3000"

var newUserID = "";
var newUserID1 = "notok"
var nullBody = null

var newAppointmentID = "";
var newAppointmentID1 = "notok"
var newBarberID = "";

var barberObjectSuccess = {
    username: "Sindri", // username þarf að vera það sama og af User
    services: [{name: "Haircut", price: 5999}]
};

var barberObjectFail = {
    something:"Some other thing" // No username
};

var barberObjectFail1 = { // name already in use
    username: "barbie",
};

var barberObjectFail2 = { // service not array
    username: "barber1",
    services: ""
};

var barberObjectFail3 = { // name and price null
    username: "barber1",
    services: [{name: null}, {price: null}]
};

var barberObjectFail4 = { // user not found
    username: "myguy",
    services: [{name: "Haircut", price: 5999}]
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

var userObjectFail3 = {
    name: null,           
    username: null, 
    email: "",
    password: "",
    phone: "",
};


var appointmentObjectSuccess = {  
    barberid: "6325eb956aec9d26d37d7723", //id þarf að vera til
    date: "2022-11-02", //eitt test er fail þegar efstu 3 eru þegar í kerfinu saman
    time: "12:00",
    userid: "6325d90f4584f7a57192113c",  //þarf að vera til í User
};
var appointmentObjectFail = {  
    barberid: "asdf", // barber ekki til
    date: "2022-11-10", 
    time: "12:00",
    userid: "6325d90f4584f7a57192113c",
};
var appointmentObjectFail1 = {  
    barberid: "6325eb956aec9d26d37d7723", //þegar appointment með id date og time
    date: "2022-11-04", 
    time: "10:30",
    userid: "6325d90f4584f7a57192113c",  
};
var appointmentObjectFail2 = {  
    barberid: "6325eb956aec9d26d37d7723", 
    date: "2022-11-05", 
    time: "12:00",
    userid: "asdf",  // customer ekki í users username
};
var appointmentObjectFail3 = {
    date: "2022-11-06", 
    time: "12:00",
    userid: "6325d90f4584f7a57192113c",
};

var appointmentObjectFail4 = {
    barberid: "6325eb956aec9d26d37d7723",
    date: "2022/11/06", 
    time: "12:00",
    userid: "6325d90f4584f7a57192113c",
};

var appointmentObjectFail5 = {
    barberid: "6325eb956aec9d26d37d7723",
    date: "2022-11-06", 
    time: "12;00",
    userid: "6325d90f4584f7a57192113c",
};

var appointmentObjectFail6 = {
    barberid: "6325eb956aec9d26d37d7723",
    date: "2021-11-06", 
    time: "12:00",
    userid: "6325d90f4584f7a57192113c",
};

var appointmentObjectFail7 = {
    barberid: "6325eb956aec9d26d37d7723",
    date: "2022-11-06", 
    time: "12:01",
    userid: "6325d90f4584f7a57192113c",
};

var servicesObjectSuccess = {
    barberid: "123",   //id vitlaust
    date: "2022-11-07",
    time: "11:00",
    userid: "6325d90f4584f7a57192113c"  
};
var servicesObject1 = {
    barberid: "6325eb956aec9d26d37d7723",
    date: "2022-11-08",
    time: "11:00",
    userid: "123"  //ekki til
};

var servicesObjectSuccess2 = {
    barberid: "6325eb956aec9d26d37d7723", // 3 efstu þegar í appointments
    date: "2022-11-12",
    time: "10:30",
    userid: "6325d90f4584f7a57192113c"  
};
var servicesObjectSuccess2 = {
    barberid: "6325eb956aec9d26d37d7723", 
    date: "2022", // ekki rétt
    time: "10", // ekki rétt
    userid: "6325d90f4584f7a57192113c"  
};

var loginObjectFail = {
    username: null,
    password: null
};

var loginObjectFail1 = {
    username: "ragnar",
    password: "ragnar1"
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

    it("POST /users no name fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/users")
            .set("Content-type", "application/json")
            .send(JSON.stringify(userObjectFail3))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Bad request. Request needs to contain name, username, email, password and phone.')
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
            res.body.should.have.property('message').eql("Invalid user id")
            Object.keys(res.body).length.should.be.eql(1);
            done();
            });
    });

    it("GET one specific user - FAIL", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/users/" + newUserID1)
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("Invalid user id")
            Object.keys(res.body).length.should.be.eql(1);
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
            //res.body.should.have.property('_id').eql(newAppointmentID);
            res.body.should.have.property('barberid').eql("6325eb956aec9d26d37d7723");
            res.body.should.have.property('date').eql("2022-11-02");
            res.body.should.have.property('time').eql("12:00");
            res.body.should.have.property('userid').eql('6325d90f4584f7a57192113c');
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

    it("GET one specific appointment - FAIL", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/appointments/" + newAppointmentID1)
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.be.a('object');
            res.body.should.have.property('message');
            res.body.message.should.be.eql('Invalid appointment id')
            done();
            });
    });

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
                res.body.message.should.be.eql('Barber does not exist.');
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
                res.body.message.should.be.eql('Barber already has an appointment at this date/time.');
                done();
            });
    });

    it("POST /appointments date format incorrect fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail4))
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Date is not in the correct format. Correct format is YYYY-MM-DD');
                done();
            });
    });

    it("POST /appointments time format incorrect fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail5))
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Time is not in the correct format. Correct format is HH:MM');
                done();
            });
    });

    it("POST /appointments date is in the past fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail6))
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('date is in the past.');
                done();
            });
    });

    it("POST /appointments date is in the past fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail7))
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Appointments can only be booked in 30 minute intervals.');
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
                res.body.message.should.be.eql('User does not exist.');
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
                res.body.message.should.be.eql('Bad request. Request needs to contain barber, date, time and userid.');
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
            res.body.should.have.property('username').eql("Sindri");
            res.body.should.have.property('name').eql("Sindri Thor");
            Object.keys(res.body).length.should.be.eql(4);
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
                res.body.message.should.be.eql("Bad request. Request needs to contain a username. All barbers must have at least one service.")
                done();
            });
    });

    it("POST /barbers service not array fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectFail2))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql("barber already exists.");
                //res.body.message.should.be.eql("barber already exists.");
                res.body.message.should.be.eql("Bad request. Services needs to be an array.")
                done();
            });
    });

    it("POST /barbers service params not correct fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectFail3))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql("barber already exists.");
                //res.body.message.should.be.eql("barber already exists.");
                res.body.message.should.be.eql("Bad request. Services needs to be an array of objects with name and price fields.")
                done();
            });
    });

    it("POST /barbers user not found fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/barbers")
            .set("Content-type", "application/json")
            .send(JSON.stringify(barberObjectFail4))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql("barber already exists.");
                //res.body.message.should.be.eql("barber already exists.");
                res.body.message.should.be.eql("No user with this username");
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

    it("POST /login no username fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/login")
            .set("Content-type", "application/json")
            .send(loginObjectFail)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql('Invalid body');
                res.body.message.should.be.eql("Bad request. Request needs to contain username and password.")
                done();
            });
    });

    it("POST /login user not found", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/login")
            .set("Content-type", "application/json")
            .send(loginObjectFail1)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');//.eql('Invalid body');
                res.body.message.should.be.eql("Invalid username or password.")
                done();
            });
    });
});