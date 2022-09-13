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
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, '/../pages/')));
app.use(bodyParser.json());
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority";
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop");
const apiVersion = "/api/v1";
app.get(apiVersion + '/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Users").find({}).toArray();
    return res.status(200).json(Users);
}));
app.get(apiVersion + 'api/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Appointments").find({}).toArray();
    return res.status(200).json(Users);
}));
app.get(apiVersion + 'api/barbers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Barbers").find({}).toArray();
    return res.status(200).json(Users);
}));
//Post endpoint for users
app.post(apiVersion + '/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    if (req.body == null) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields
    if (req.body.name == null || req.body.username == null || req.body.email == null || req.body.password == null || req.body.phone == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain name, username, email, password and phone." });
    }
    //check if user already exists
    const user = yield Database.collection("Users").findOne({ username: req.body.username });
    if (user != null) {
        return res.status(400).json({ message: "Username already exists." });
    }
    //create user and insert into database, then return the result
    const Users = yield Database.collection("Users").insertOne(req.body);
    return res.status(200).json(Users);
}));
//Post endpoint for appointments
app.post(apiVersion + '/appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    if (req.body == null) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields
    if (req.body.barberid == null || req.body.date == null || req.body.time == null || req.body.customer == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain barber, date, time and customer." });
    }
    //check if barber is busy at this time and date.
    const appointment = yield Database.collection("Appointments").findOne({ barber: req.body.barberid, date: req.body.date, time: req.body.time });
    if (appointment != null) {
        return res.status(400).json({ message: "barber already has an appointment at this date/time." });
    }
    //check if barber exists using mongoDB id
    const barber = yield Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(req.body.barberid) });
    if (barber == null) {
        return res.status(400).json({ message: "barber does not exist." });
    }
    //check if customer exists
    const customer = yield Database.collection("Users").findOne({ username: req.body.customer });
    if (customer == null) {
        return res.status(400).json({ message: "customer does not exist." });
    }
    //check formatting of date and time
    if (!req.body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res.status(400).json({ message: "date is not in the correct format. Correct format is YYYY-MM-DD" });
    }
    if (!req.body.time.match(/^\d{2}:\d{2}$/)) {
        return res.status(400).json({ message: "time is not in the correct format. Correct format is HH:MM" });
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
    return res.status(200).json(Appointments);
}));
//delete endpoint for appointments (using the mongodb id) -- possibly create our own id? 
app.delete(apiVersion + '/appointments/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if id is not null
    if (req.params.id == null) {
        return res.status(400).json({ message: 'Invalid id' });
    }
    //delete appointment and return the result
    const Appointments = yield Database.collection("Appointments").deleteOne({ _id: mongodb.ObjectId(req.params.id) });
    return res.status(200).json(Appointments);
}));
//get endpoint for barbers
app.get(apiVersion + '/barbers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Barbers = yield Database.collection("Barbers").find({}).toArray();
    return res.status(200).json(Barbers);
}));
//post endpoint for barbers, takes in a username and generates a barber
app.post(apiVersion + '/barbers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //check if body is not null
    if (req.body == null) {
        return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields, mongo will create an id for us
    if (req.body.username == null) {
        return res.status(400).json({ message: "Bad request. Request needs to contain a username." });
    }
    //check if a user with this username exists. All barbers need to have a username, maybe call this method when a "barber" user is created?
    const user = yield Database.collection("Users").findOne({ username: req.body.username });
    if (user == null) {
        return res.status(400).json({ message: "No user with this username." });
    }
    //check if barber already exists (may cause problems, this check is not really needed.causes problems if two barbers share the same name,
    //however, this is very unlikely in our system.)
    const barber = yield Database.collection("Barbers").findOne({ name: req.body.name });
    if (barber != null) {
        return res.status(400).json({ message: "barber already exists." });
    }
    //add the name of the user to the barber object
    req.body.name = user.name;
    //create barber and insert into database, then return the result
    const Barbers = yield Database.collection("Barbers").insertOne(req.body);
    return res.status(200).json(Barbers);
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map