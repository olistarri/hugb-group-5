"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fridagar = require('fridagar');
const app = (0, express_1.default)();
const saltRounds = 10;
const port = 3000;
const JWT_SECRET = "VerySecretStringDoNotShare";
const services = [
    {
        name: 'Haircut',
        price: 5999,
    },
    {
        name: 'Shave',
        price: 2999,
    },
    {
        name: 'Colouring',
        price: 10999,
    }
];
app.use(express_1.default.static(path_1.default.join(__dirname, '/../pages/')));
app.use(express_1.default.static(path_1.default.join(__dirname, '/../static/')));
app.use(express_1.default.static(path_1.default.join(__dirname, '/../')));
app.use(bodyParser.json());
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority";
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop");
const apiVersion = "/api/v1";
//get all users
app.get(apiVersion + '/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.query.name) {
        //find all users whose name contains name 
        const users = yield Database.collection("Users").find({ name: { $regex: req.query.name } }).toArray();
        // remove all passwords from the users
        users.forEach((user) => {
            delete user.password;
        });
        return res.send(users);
    }
    const Users = yield Database.collection("Users").find({}).toArray();
    return res.status(200).json(Users);
}));
//get a single user
app.get(apiVersion + '/users/:userid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.userid) {
        if (req.params.userid.length != 24 || !mongodb.ObjectID.isValid(req.params.userid)) {
            //console.log("Invalid ID");
            return res.status(400).json({ message: "Invalid user id" });
        }
        // find the user with the given id if not found return 400
        const user = yield Database.collection("Users").findOne({ _id: new mongodb.ObjectID(req.params.userid) });
        if (!user) {
            return res.status(400).json({ message: "Invalid user id" });
        }
        delete user.password;
        return res.status(200).json(user);
    }
}));
//Get all appointments
app.get(apiVersion + '/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query = {};
    //append query params to query
    req.query.userid ? query = Object.assign(Object.assign({}, query), { userid: req.query.userid }) : null;
    req.query.date ? query = Object.assign(Object.assign({}, query), { date: req.query.date }) : null;
    req.query.barberid ? query = Object.assign(Object.assign({}, query), { barberid: req.query.barberid }) : null;
    if (Object.keys(query).length != 0) {
        //check if query includes date, to see if it is a holiday.
        if (req.query.date) {
            // if date os a string
            if (typeof req.query.date === "string") {
                const year = req.query.date.split("-")[0];
                const month = req.query.date.split("-")[1];
                const holidays = fridagar.getHolidays(year, month);
                // check if date is in holiday array
                let currentHoliday = holidays.find((holiday) => {
                    return holiday.date.toISOString().split("T")[0] === req.query.date;
                });
                if (currentHoliday) {
                    return res.status(200).json({ message: currentHoliday.description });
                }
            }
        }
        //get appointments that match query
        let appointments = yield Database.collection("Appointments").find(query).toArray();
        // save all barberids in an array
        let barberids = appointments.map((appointment) => appointment.barberid);
        // get all barbers with mongodb id that match the barberids
        let barbers = yield Database.collection("Barbers").find({ _id: { $in: barberids.map((id) => mongodb.ObjectId(id)) } }).toArray();
        // add the barbers to the appointments
        appointments = appointments.map((appointment) => {
            appointment.barber = barbers.find((barber) => barber._id == appointment.barberid).name;
            return appointment;
        });
        return res.status(200).send(appointments);
    }
    //get all appointments
    let appointments = yield Database.collection("Appointments").find({}).toArray();
    appointments.barbername = yield Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(appointments.barberid) }).name;
    return res.status(200).send(appointments);
}));
//get a single appointment
app.get(apiVersion + '/appointments/:appointmentid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.appointmentid) {
        if (!mongodb.ObjectID.isValid(req.params.appointmentid)) {
            return res.status(400).json({ message: "Invalid appointment id" });
        }
        const appointment = yield Database.collection("Appointments").findOne({ _id: mongodb.ObjectId(req.params.appointmentid) });
        return res.json(appointment);
    }
}));
app.get(apiVersion + '/barbers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Barbers").find({}).toArray();
    return res.status(200).json(Users);
}));
//get a single barber
app.get(apiVersion + '/barbers/:barberid', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.barberid) {
        const barber = yield Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(req.params.barberid) });
        return res.status(200).json(barber);
    }
}));
app.get(apiVersion + '/services', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(200).json(services);
}));
//Post endpoint for users
app.post(apiVersion + '/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    //empty json object
    if (req.body == null || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields
    if (req.body.name == null || req.body.username == null || req.body.email == null || req.body.password == null || req.body.phone == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain name, username, email, password and phone." });
    }
    //Check if fields are empty
    if (req.body.name == "" || req.body.username == "" || req.body.email == "" || req.body.password == "" || req.body.phone == "") {
        return res.status(400).json({ message: "Bad request. Request needs to contain name, username, email, password and phone, cannot be empty." });
    }
    //check if user already exists
    const user = yield Database.collection("Users").findOne({ username: req.body.username });
    if (user != null) {
        return res.status(400).json({ message: "Username already exists." });
    }
    // use bcrypt to hash password
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash;
    //create user and insert into database, then return the result
    const User = yield Database.collection("Users").insertOne(req.body);
    //add line to json
    User.token = jwt.sign({ username: req.body.username, userid: User.insertedId }, JWT_SECRET, { expiresIn: "30d" });
    return res.status(200).json(User);
}));
//Post endpoint for appointments
app.post(apiVersion + '/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    if (req.body == null || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields
    if (req.body.barberid == null || req.body.date == null || req.body.time == null || req.body.userid == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain barber, date, time and userid." });
    }
    //check if barber exists using mongoDB id
    //check if id is valid id
    if (!mongodb.ObjectId.isValid(req.body.barberid)) {
        return res.status(400).json({ message: "Barber does not exist." });
    }
    const barber = yield Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(req.body.barberid) });
    if (barber == null) {
        return res.status(400).json({ message: "Barber does not exist." });
    }
    //check if barber is busy at this time and date.
    const appointment = yield Database.collection("Appointments").findOne({ barberid: req.body.barberid, date: req.body.date, time: req.body.time });
    if (appointment != null) {
        return res.status(400).json({ message: "Barber already has an appointment at this date/time." });
    }
    //check if customer exists using mongoDB id
    //check if id is valid id
    if (!mongodb.ObjectId.isValid(req.body.userid)) {
        return res.status(400).json({ message: "User does not exist." });
    }
    const user = yield Database.collection("Users").findOne({ _id: mongodb.ObjectId(req.body.userid) });
    if (user == null) {
        return res.status(400).json({ message: "User does not exist." });
    }
    //check formatting of date and time
    if (!req.body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res.status(400).json({ message: "Date is not in the correct format. Correct format is YYYY-MM-DD" });
    }
    if (!req.body.time.match(/^\d{2}:\d{2}$/)) {
        return res.status(400).json({ message: "Time is not in the correct format. Correct format is HH:MM" });
    }
    //also check if the date is in the future
    const today = new Date();
    const date = new Date(req.body.date);
    if (date < today) {
        return res.status(400).json({ message: "date is in the past." });
    }
    //another check to see if appointment is happening in 30 minute intervals
    const time = req.body.time.split(":");
    if (time[1] != "00" && time[1] != "30") {
        return res.status(400).json({ message: "Appointments can only be booked in 30 minute intervals." }); //maybe change this to 15 minute intervals if appointments are 45 mins.. 
    }
    //create appointment and insert into database, then return the result
    const Appointments = yield Database.collection("Appointments").insertOne(req.body);
    Appointments.barbername = barber.name;
    return res.status(200).json(Appointments);
}));
//post endpoint for barbers, takes in a username and generates a barber
app.post(apiVersion + '/barbers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    if (req.body == null || Object.keys(req.body).length === 0) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields, mongo will create an id for us
    if (req.body.username == null || req.body.services == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain a username. All barbers must have at least one service." });
    }
    //check if services is a json array with name and price fields
    if (!Array.isArray(req.body.services)) {
        return res.status(400).json({ message: "Bad request. Services needs to be an array." });
    }
    for (let i = 0; i < req.body.services.length; i++) {
        if (req.body.services[i].name == null || req.body.services[i].price == null) {
            return res.status(400).json({ message: "Bad request. Services needs to be an array of objects with name and price fields." });
        }
    }
    //check if a user with this username exists. All barbers need to have a username, maybe call this method when a "barber" user is created?
    const user = yield Database.collection("Users").findOne({ username: req.body.username });
    if (user == null) {
        return res.status(400).json({ message: "No user with this username" });
    }
    //check if barber already exists (may cause problems, this check is not really needed.causes problems if two barbers share the same name,
    //however, this is very unlikely in our system.)
    const barber = yield Database.collection("Barbers").findOne({ username: req.body.username });
    if (barber != null) {
        return res.status(400).json({ message: "This user is already a barber." });
    }
    //add the name of the user to the barber object
    req.body.name = user.name;
    //create barber and insert into database, then return the result
    const Barbers = yield Database.collection("Barbers").insertOne(req.body);
    return res.status(200).json(Barbers);
}));
app.post(apiVersion + "/login", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    if (req.body == null) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields
    if (req.body.username == null || req.body.password == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain username and password." });
    }
    //check if user exists
    const user = yield Database.collection("Users").findOne({ username: req.body.username });
    // use bcrypt to compare the password
    if (user == null || !bcrypt.compareSync(req.body.password, user.password)) {
        return res.status(400).json({ message: "Invalid username or password." });
    }
    else {
        // Check if the username is a barber
        const barber = yield Database.collection("Barbers").findOne({ username: req.body.username });
        if (barber != null) {
            const token = jwt.sign({ username: user.username, userid: user._id, isBarber: true }, JWT_SECRET, { expiresIn: "30d" });
            return res.status(200).json({ token: token });
        }
        const token = jwt.sign({ username: user.username, userid: user._id, isBarber: false }, JWT_SECRET, { expiresIn: "30d" });
        return res.status(200).json({ token: token });
        //create a token for the user
    }
}));
app.delete(apiVersion + '/barbers/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if id is not null
    if (req.params.id == null) {
        return res.status(400).json({ message: 'Invalid id' });
    }
    //delete barber and return the result
    const Barbers = yield Database.collection("Barbers").deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    return res.status(200).json(Barbers);
}));
app.delete(apiVersion + '/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if id is not null
    if (req.params.id == null) {
        return res.status(400).json({ message: 'Invalid id' });
    }
    //delete user and return the result
    const Users = yield Database.collection("Users").deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    return res.status(200).json(Users);
}));
//delete endpoint for appointments (using the mongodb id) -- possibly create our own id? 
app.delete(apiVersion + '/appointments/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if id is not null and valid mongodb id
    if (req.params.id == null || req.params.id == "" || !mongodb.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid id' });
    }
    //if the appointment is in the future, delete appointment and return the result
    const appointment = yield Database.collection("Appointments").findOne({ _id: mongodb.ObjectId(req.params.id) });
    if (appointment == null) {
        return res.status(400).json({ message: "No appointment with this id" });
    }
    //parse date from string
    const currentDate = new Date(appointment.date);
    if (currentDate > new Date()) {
        const Appointments = yield Database.collection("Appointments").deleteOne({ _id: mongodb.ObjectId(req.params.id) });
        return res.status(200).json(Appointments);
    }
    else {
        return res.status(400).json({ message: "Cannot delete appointments in the past." });
    }
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map