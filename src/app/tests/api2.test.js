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
        //server.resetState();
        done();
    });
    
});