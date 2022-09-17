import express, { Request, Response } from 'express';
import path from 'path';
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();
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

app.use(express.static(path.join(__dirname, '/../pages/')));
app.use(express.static(path.join(__dirname, '/../static/')));
app.use(bodyParser.json());

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority"
const client = new MongoClient(URI,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop")
const apiVersion = "/api/v1"

//get all users
app.get(apiVersion + '/users', async (req: Request, res: Response) => {
  if (req.query.name) {
    //find all users whose name contains name 
    const users = await Database.collection("Users").find({name: {$regex: req.query.name}}).toArray();
    // remove all passwords from the users
    users.forEach((user: any) => {
      delete user.password;
    });
    return res.send(users);
  }

  const Users:JSON = await Database.collection("Users").find({}).toArray();
  return res.status(200).json(Users);
});

//get a single user
app.get(apiVersion + '/users/:userid', async (req: Request, res: Response) => {
  if (req.params.userid) {
    const user = await Database.collection("Users").findOne({ _id: mongodb.ObjectId(req.params.userid) });
    // remove password from response
    delete user.password;
    return  res.json(user);
  }
});


//Get all appointments
app.get(apiVersion + '/appointments', async (req: Request, res: Response) => {
  let query = {};
  //append query params to query
  req.query.userid ? query = {...query, userid: req.query.userid} : null;
  req.query.date ? query = {...query, date: req.query.date} : null;
  req.query.barberid ? query = {...query, barberid: req.query.barberid} : null;
  if (Object.keys(query).length != 0) {
    const appointments = await Database.collection("Appointments").find(query).toArray();
    return res.status(200).send(appointments);
  }
  if (req.query.barberid){
    const appointments = await Database.collection("Appointments").find({barberid: req.query.barberid}).toArray();
    return res.status(200).send(appointments);
  }
  const Users:JSON = await Database.collection("Appointments").find({}).toArray();
  return res.status(200).json(Users);
});
//get a single appointment
app.get(apiVersion + '/appointments/:appointmentid', async (req: Request, res: Response) => {
  if (req.params.appointmentid) {
    const appointment = await Database.collection("Appointments").findOne({ _id: mongodb.ObjectId(req.params.appointmentid) });
    return  res.json(appointment);
  }
});



app.get(apiVersion + '/barbers', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Barbers").find({}).toArray();
  return res.status(200).json(Users);
});

//get a single barber
app.get(apiVersion + '/barbers/:barberid', async (req: Request, res: Response) => {
  if (req.params.barberid) {
    const barber = await Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(req.params.barberid) });
    return  res.status(200).json(barber);
  }
});

app.get(apiVersion + '/services', async (req: Request, res: Response) => {
  return res.status(200).json(services);
});

//Post endpoint for users
app.post(apiVersion + '/users', async (req: Request, res: Response) => {
  //check if body is not null
  //empty json object
  if (req.body == null || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Invalid body' });
  }
  //check if body has all the required fields
  if (req.body.name == null || req.body.username == null || req.body.email == null  || req.body.password == null || req.body.phone == null) {
    return res.status(400).json({message: "Bad request. Request needs to contain name, username, email, password and phone."});
  }
  //Check if fields are empty
  if (req.body.name == "" || req.body.username == "" || req.body.email == ""  || req.body.password == "" || req.body.phone == "") {
    return res.status(400).json({message: "Bad request. Request needs to contain name, username, email, password and phone, cannot be empty."});
  }

  //check if user already exists
  const user = await Database.collection("Users").findOne({username: req.body.username});
  if (user != null) {
    return res.status(400).json({message: "Username already exists."});
  }
  // use bcrypt to hash password
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(req.body.password, salt);
  req.body.password = hash;
  //create user and insert into database, then return the result
  const User = await Database.collection("Users").insertOne(req.body);
  //add line to json
  User.token = jwt.sign({username: req.body.username, userid: User.insertedId}, JWT_SECRET, {expiresIn: "30d"});
  return res.status(200).json(User);
});

//Post endpoint for appointments
app.post(apiVersion + '/appointments', async (req: Request, res: Response) => {
  //check if body is not null
  if (req.body == null || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Invalid body' });
  }
  //check if body has all the required fields
  if (req.body.barberid == null || req.body.date == null || req.body.time == null || req.body.customer == null) {
    return res.status(400).json({message: "Bad request. Request needs to contain barber, date, time and customer."});
  }
  //check if barber exists using mongoDB id
  //check if id is valid id
  if (!mongodb.ObjectId.isValid(req.body.barberid)) {
    return res.status(400).json({message: "barber does not exist."});
  }
  const barber = await Database.collection("Barbers").findOne({_id: mongodb.ObjectId(req.body.barberid)});
  if (barber == null) {
    return res.status(400).json({message: "barber does not exist."});
  }

  //check if barber is busy at this time and date.
  const appointment = await Database.collection("Appointments").findOne({barberid: req.body.barberid, date: req.body.date, time: req.body.time});
  if (appointment != null) {
    return res.status(400).json({message: "barber already has an appointment at this date/time."});
  }
  //check if customer exists
  const customer = await Database.collection("Users").findOne({username: req.body.customer});
  if (customer == null) {
    return res.status(400).json({message: "customer does not exist."});
  }
  //check formatting of date and time
  if (!req.body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({message: "date is not in the correct format. Correct format is YYYY-MM-DD"});
  }
  if (!req.body.time.match(/^\d{2}:\d{2}$/)) {
    return res.status(400).json({message: "time is not in the correct format. Correct format is HH:MM"});
  }
  //also check if the date is in the future
  const today = new Date();
  const date = new Date(req.body.date);
  if (date < today) {
    return res.status(400).json({message: "date is in the past."});
  }
  //another check to see if appointment is happening in 30 minute intervals
  const time = req.body.time.split(":");
  if (time[1] != "00" && time[1] != "30") {
    return res.status(400).json({message: "Appointments can only be booked in 30 minute intervals."}); //maybe change this to 15 minute intervals if appointments are 45 mins.. 
  }
  //create appointment and insert into database, then return the result
  const Appointments:JSON = await Database.collection("Appointments").insertOne(req.body);
  return res.status(200).json(Appointments);
});

//post endpoint for barbers, takes in a username and generates a barber
app.post(apiVersion + '/barbers', async (req: Request, res: Response) => {
  //check if body is not null
  if (req.body == null || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Invalid body' });
  }
  //check if body has all the required fields, mongo will create an id for us
  if (req.body.username == null || req.body.services == null) {
    return res.status(400).json({message: "Bad request. Request needs to contain a username. All barbers must have at least one service."});
  }
  //check if services is a json array with name and price fields
  if (!Array.isArray(req.body.services)) {
    return res.status(400).json({message: "Bad request. Services needs to be an array."});
  }
  for (let i = 0; i < req.body.services.length; i++) {
    if (req.body.services[i].name == null || req.body.services[i].price == null) {
      return res.status(400).json({message: "Bad request. Services needs to be an array of objects with name and price fields."});
    }
  }




  //check if a user with this username exists. All barbers need to have a username, maybe call this method when a "barber" user is created?
  const user = await Database.collection("Users").findOne({username: req.body.username});
  if (user == null) {
    return res.status(400).json({message: "No user with this username"});
  }
  //check if barber already exists (may cause problems, this check is not really needed.causes problems if two barbers share the same name,
  //however, this is very unlikely in our system.)
  const barber = await Database.collection("Barbers").findOne({username: req.body.username});
  if (barber != null) {
    return res.status(400).json({message: "This user is already a barber."});
  }
  //add the name of the user to the barber object
  req.body.name = user.name;
  //create barber and insert into database, then return the result
  const Barbers:JSON = await Database.collection("Barbers").insertOne(req.body);
  return res.status(200).json(Barbers);
});

app.post(apiVersion+"/login", async (req: Request, res: Response) => {
  //check if body is not null
  if (req.body == null) {
    return res.status(400).json({ message: 'Invalid body' });
    }
    //check if body has all the required fields
    if (req.body.username == null || req.body.password == null) {
      return res.status(400).json({message: "Bad request. Request needs to contain username and password."});
    }
    //check if user exists
    const user = await Database.collection("Users").findOne({username: req.body.username});

    // use bcrypt to compare the password
    if (user == null || !bcrypt.compareSync(req.body.password, user.password)) {
      return res.status(400).json({message: "Invalid username or password."});
    }
    else
    {
      //create a token for the user
      const token = jwt.sign({username: user.username, userid: user._id}, JWT_SECRET, {expiresIn: "30d"});
      return res.status(200).json({token: token});
    }

   
});

app.delete(apiVersion + '/barbers/:id', async (req: Request, res: Response) => {
  //check if id is not null
  if (req.params.id == null) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  //delete barber and return the result
  const Barbers:JSON = await Database.collection("Barbers").deleteOne({_id: mongodb.ObjectId(req.params.id)});
  return res.status(200).json(Barbers);
});

app.delete(apiVersion + '/users/:id', async (req: Request, res: Response) => {
  //check if id is not null
  if (req.params.id == null) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  //delete user and return the result
  const Users:JSON = await Database.collection("Users").deleteOne({_id: mongodb.ObjectId(req.params.id)});
  return res.status(200).json(Users);
});

//delete endpoint for appointments (using the mongodb id) -- possibly create our own id? 
app.delete(apiVersion + '/appointments/:id', async (req: Request, res: Response) => {
  //check if id is not null
  if (req.params.id == null) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  //delete appointment and return the result
  const Appointments:JSON = await Database.collection("Appointments").deleteOne({_id: mongodb.ObjectId(req.params.id)});
  return res.status(200).json(Appointments);
});



app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});