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
var newAppointmentID1 = "63260e0b6d67379920e90055"
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
    date: "2022-12-14", //eitt test er fail þegar efstu 3 eru þegar í kerfinu saman
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

var appointmentObjectFail8 = {
    barberid: "6325eb956aec9d26d37d1234",
    date: "2022-11-06", 
    time: "12:01",
    userid: "6325d90f4584f7a57192113c",
};

var appointmentObjectFail9 = {  
    barberid: "6325eb956aec9d26d37d7723", 
    date: "2022-11-05", 
    time: "12:00",
    userid: "6325eb956aec9d26d37d1234",  // customer ekki í users username
};

var appointmentObjectFail10 = {  
    barberid: "6325eb956aec9d26d37d7723", 
    date: "2022-11-05", 
    time: "25:00",
    userid: "6325d90f4584f7a57192113c",  
};

var patchAppointment = {   
    date: "2022-12-20", 
    time: "15:00",
    needsRescheduling: false
};

var patchAppointmentFail = { 
    date: "12-2022-20", 
    time: "15:00",
    needsRescheduling: false
}

var patchAppointmentFail1 = { 
    date: "2022-12-20", 
    time: "15-00",
    needsRescheduling: false
}

var patchAppointmentFail2 = { 
    date: "2022-12-20", 
    time: "15:01",
    needsRescheduling: false
}

var patchAppointmentFail3 = { 
    date: "2021-12-20", 
    time: "15:00",
    needsRescheduling: false
}

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

var holidayObj = {
    barberid: "63260d8d6d67379920e9005e", 
    date: "2022-11-20", 
    userid: "63260c3a6d67379920e9005d"  
};

var holidayObjFail = {
    barberid: "63260d8d6d67379920e9005e", 
    date: "2022/12/12", 
    userid: "63260c3a6d67379920e9005d"  
};

var holidayObjFail2 = {
    barberid: "63260d8d6d67379920e9005e", 
    date: "2022-12-12", 
    userid: "63260c3a6d67379920e9005d"  
};

var holidayObjFail3 = {
    barberid: "63260d8d6d67379920e9005e", 
    date: "2021-12-12", 
    userid: "63260c3a6d67379920e9005d"  
};

var holidayObjFail4 = {
    barberid: "63260d8d6d67379920e9005e", 
    date: "2021-11-21", 
    userid: "6339bd012047a31aeab91c0a"  
};

var token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9saXN0YXJyaSIsInVzZXJpZCI6IjYzMjVkOTBmNDU4NGY3YTU3MTkyMTEzYyIsImlzQmFyYmVyIjpmYWxzZSwiaWF0IjoxNjY1OTQzNDgxLCJleHAiOjE2Njg1MzU0ODF9.BdF1acWXEBquj6XmhrG3c9XWzvVQSsYohhOcKVR8E-A";

var holidayToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJhcmJlcjEwIiwidXNlcmlkIjoiNjMyNjBjM2E2ZDY3Mzc5OTIwZTkwMDVkIiwiaXNCYXJiZXIiOnRydWUsImJhcmJlcmlkIjoiNjMyNjBkOGQ2ZDY3Mzc5OTIwZTkwMDVlIiwiaWF0IjoxNjY1OTQ5NjkwLCJleHAiOjE2Njg1NDE2OTB9.A7pKLZo7tU7SeFILr0NSwGnQSqvumpzQd9gVOmoZm_o"
var holidayTokenFail = "";

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

    // it("DELETE /users invalid id", function (done) {
    //     chai.request(apiUrl)
    //         .delete(apiVersion + "/users/" + "123456789101")
    //         .end((err, res) => {
    //             res.should.have.status(400);
    //             res.should.be.json;
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('message');
    //             res.body.message.should.be.eql('Invalid id')
    //             done();
    //         });
    // })

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
            res.body.should.have.property('date').eql("2022-12-14");
            res.body.should.have.property('time').eql("12:00");
            res.body.should.have.property('userid').eql('6325d90f4584f7a57192113c');
            Object.keys(res.body).length.should.be.eql(5);
            done();
            });
    });

    it("PATCH appointment no id - FAIL", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + "123")
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointment))
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("Invalid id");
            done();
            });
    });

    it("PATCH appointment no id - FAIL", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + "633c4c2b59ebc524fe92cec7")
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointment))
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("No appointment with this id");
            done();
            });
    });

    it("PATCH appointment incorrect date format - FAIL", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + newAppointmentID)
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointmentFail))
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("Date is not in the correct format. Correct format is YYYY-MM-DD");
            done();
            });
    });

    it("PATCH appointment incorrect time format - FAIL", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + newAppointmentID)
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointmentFail1))
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("Time is not in the correct format. Correct format is HH:MM");
            done();
            });
    });

    it("PATCH appointment incorrect time format 2 - FAIL", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + newAppointmentID)
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointmentFail2))
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("Appointments can only be booked in 30 minute intervals.");
            done();
            });
    });

    it("PATCH appointment date in the past - FAIL", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + newAppointmentID)
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointmentFail3))
            .end((err, res) => {
            res.should.have.status(400);
            res.should.be.json;
            res.body.should.have.property('message').eql("Invalid date");
            done();
            });
    });

    it("PATCH appointment - SUCCESS", function (done) {
        chai.request(apiUrl)
            .patch(apiVersion + "/appointments/" + newAppointmentID)
            .set("Content-type", "application/json")
            .send(JSON.stringify(patchAppointment))
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.should.have.property('acknowledged').eql(true);
            res.body.should.have.property('modifiedCount').eql(1);
            res.body.should.have.property('upsertedId').eql(null);
            res.body.should.have.property('upsertedCount').eql(0);
            res.body.should.have.property('matchedCount').eql(1);
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

    it("DELETE /appointments/:id No appointment with this id", function (done) {
        chai.request(apiUrl)
            .delete(apiVersion + "/appointments/" + newAppointmentID1)
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('No appointment with this id');
                done();
            });
    })

    it("DELETE /appointments/:id Cant delete appointment in the past", function (done) {
        chai.request(apiUrl)
            .delete(apiVersion + "/appointments/" + "634971e086674747e3514bef")
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Cannot delete appointments in the past.');
                done();
            });
    })

    // it("DELETE /appointments/:id No appointment with this id", function (done) {
    //     chai.request(apiUrl)
    //         .delete(apiVersion + "/appointments/" + newAppointmentID)
    //         .end((err, res) => {
    //             res.should.have.status(400);
    //             res.should.be.json;
    //             res.body.should.be.a('object');
    //             res.body.should.have.property('message');
    //             res.body.message.should.be.eql('Cannot delete appointments in the past.');
    //             done();
    //         });
    // })

    it("GET one specific appointment - FAIL", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/appointments/" + "notok")
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

    it("POST /appointments barber not found fail ", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail8))
            .end((err, res) => {
                res.should.have.status(400);
                res.should.be.json;
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Barber does not exist.');
                done();
            });
    });

    it("POST /appointments barber id wrong format fail ", function (done) { 
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

    it("POST /appointments time incorrect", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail10))
            .end((err, res) => {
                res.should.have.status(400);
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.message.should.be.eql('Time is not in the correct format. Correct format is HH:MM');
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

    it("POST /appointments customers username doesn't exist fail", function (done) {
        chai.request(apiUrl)
            .post(apiVersion + "/appointments")
            .set("Content-type", "application/json")
            .send(JSON.stringify(appointmentObjectFail9))
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
    it("GET /appointments with holiday - SUCCESS", function (done) {
        chai.request(apiUrl)
            .get(apiVersion + "/appointments?date=2022-12-24")
            .end((err, res) => {
            res.should.have.status(200);
            res.should.be.json;
            res.body.message.should.be.eql('Aðfangadagur');
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
    
    //.

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
                res.body.should.have.property('message');
                res.body.message.should.be.eql("Invalid username or password.")
                done();
            });
    });
});

