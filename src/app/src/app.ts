import express, { Request, Response } from 'express';
import path from 'path';
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fridagar = require('fridagar');
const app = express();
const saltRounds = 10;
const port = 3000;
const JWT_SECRET = "VerySecretStringDoNotShare";

app.use(express.static(path.join(__dirname, '/../pages/')));
app.use(express.static(path.join(__dirname, '/../static/')));
app.use(express.static(path.join(__dirname, '/../')));
app.use(bodyParser.json());

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority"
const client = new MongoClient(URI,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop")
const apiVersion = "/api/v1"

//get all users
/**
 * This endpoint returns all users in the database with an optional argument to filter by name
 * @api {get} /api/v1/users Get all users
 * @apiName getAllUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiBody {String} [name] Get user by name
 * @apiSuccess {Object[]} [users] Array of users
 * @apiSuccess {String} [_id] The user's id
 * @apiSuccess {String} [username] The user's username
 * @apiSuccess {String} [email] The user's email
 * @apiSuccess {String} [name] The user's name
 * @apiSuccess {String} [phone] The user's phone
 * @apiSuccessExample {json} Success:
 * [
    {
        "_id": "6325d8ce4584f7a57192113b",
        "username": "Sindri",
        "email": "sindri@sindri.is",
        "name": "Sindri Thor",
        "phone": "5812345"
    },
    {
        "_id": "6325d90f4584f7a57192113c",
        "username": "olistarri",
        "email": "olistarri@olistarri.is",
        "name": "Ólafur Starri Páls",
        "phone": "5812345"
    },
    {
        "_id": "6325d93d4584f7a57192113d",
        "username": "barber1",
        "email": "barber@barbersinc.com",
        "name": "Maggi Klippari",
        "phone": "8885555"
    },
 * 
 */
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

  const Users = await Database.collection("Users").find({}).toArray();
  Users.forEach((user:any) => {
    delete user.password;     // Remove all passwords from the users
  });
  return res.status(200).json(Users);
});

//get a single user
/**
 * This endpoint returns a single user
 * @api {get} /api/v1/users/:userid Get a single user
 * @apiName getUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiParam {String} userid Id of the user to get
 * @apiSuccess {String} [_id] The user's id
 * @apiSuccess {String} [username] The user's username
 * @apiSuccess {String} [name] The user's name
 * @apiSuccess {Boolean} [email] The user's email
 * @apiSuccess {Boolean} [ohone] The user's phone number
 * query params 
 * @apiSuccessExample {json} Success:
 *{
    "_id": "635e8d35ea58f2429520cea6",
    "username": "test",
    "name": "notandi1",
    "email": "notandi1@ru.is",
    "phone": "5885522"
}
  * @apiErrorExample {json} Invalid ID error:
  * {
  *  "error": "Invalid user id"
 *  }
 */
app.get(apiVersion + '/users/:userid', async (req: Request, res: Response) => {
  if (req.params.userid) {
    if(req.params.userid.length != 24 || !mongodb.ObjectID.isValid(req.params.userid)){
      //console.log("Invalid ID");
      return res.status(400).json({message: "Invalid user id"});
    }
    // find the user with the given id if not found return 400
    const user = await Database.collection("Users").findOne({_id: new mongodb.ObjectID(req.params.userid)});
    if (!user) {
      return res.status(400).json({message: "Invalid user id"});
    }
    delete user.password;
    return res.status(200).json(user);
  }
});


//Get all appointments
/**
 * This endpoint returns all appointments
 * @api {get} /api/v1/appointments Get all appointments
 * 
 * @apiName GetAppointments
 * @apiGroup Appointments
 * @apiVersion 1.0.0
 * @apiSuccess {Object[]} [appointments] List of appointments
 * @apiSuccess {String} [appointments._id] MongoDB Id of the appointment
 * @apiSuccess {String} [appointments.date] Date of the appointment
 * @apiSuccess {String} [appointments.time] Time of the appointment
 * @apiSuccess {String} [appointments.userid] MongoDB UserID of the appointment
 * @apiSuccess {String} [appointments.barberid] MongoDB BarberID of the appointment
 * @apiSuccess {String} [appointments.service] Service and price of the appointment
 * @apiSuccess {Boolean} [appointments.cancelled] If appointment is canceled, this is true. Field added when appointment is canceled by user.
 * @apiSuccess {Boolean} [appointments.needsRescheduling] If appointment needs rescheduling, this is true. Field added when appointment is canceled by barber.
 * query params 
 * @apiBody {String} [date] Returns all appointments on the given date
 * @apiBody {String} [userid] Returns all appointments for this user 
 * @apiBody {String} [barberid] Returns all appointments for this barber
 * @apiBody {String} [id] Returns the appointment with the given id
 * @apiSuccessExample {json} Success:
 * [
    {
        "_id": "633c4c2b59ebc524fe92cec6",
        "date": "2022-11-04",
        "time": "14:30",
        "userid": "6325d90f4584f7a57192113c",
        "barberid": "6325eb956aec9d26d37d7723",
        "service": "Haircut,5999",
        "cancelled": true,
        "needsRescheduling": false
    },
    {
        "_id": "634971e086674747e3514bef",
        "date": "2022-10-14",
        "time": "16:30",
        "userid": "6325d90f4584f7a57192113c",
        "barberid": "63260d8d6d67379920e9005e",
        "service": "Haircut,5999"
    }
  ]  
 *
 */
app.get(apiVersion + '/appointments', async (req: Request, res: Response) => {
  let query = {};
  //append query params to query
  req.query.userid ? query = {...query, userid: req.query.userid} : null;
  req.query.date ? query = {...query, date: req.query.date} : null;
  req.query.barberid ? query = {...query, barberid: req.query.barberid} : null;
  req.query.id ? query = {...query, _id: new mongodb.ObjectID(req.query.id)} : null;
  if (Object.keys(query).length != 0) {
    //check if query includes date, to see if it is a holiday.
    if (req.query.date) {
      // if date os a string
      if (typeof req.query.date === "string") {
        const year = req.query.date.split("-")[0];
        const month = req.query.date.split("-")[1];
        const holidays = fridagar.getHolidays(year, month);
        // check if date is in holiday array
    
        let currentHoliday = holidays.find((holiday: any) => {
          return holiday.date.toISOString().split("T")[0] === req.query.date;
        });
        // or if it is a weekend
        let currentDay = new Date(req.query.date).getDay();
        if (currentHoliday) {
          return res.status(200).json({message: currentHoliday.description});
        }
        if (currentDay === 0 || currentDay === 6) {
          return res.status(200).json({message: "Weekend"});
        }
      }
    }
    // check the holiday collection for the date and barberid
    const dayoff = await Database.collection("Daysoff").findOne({date: req.query.date, barberid: req.query.barberid});
    if (dayoff) {
      return res.status(200).json({message: "barber is unavailable"});
    }
    //get appointments that match query
    let appointments = await Database.collection("Appointments").find(query).toArray();
     // save all barberids and userids in an array
    let barberids = appointments.map((appointment: any) => appointment.barberid);
    let userids = appointments.map((appointment: any) => appointment.userid);
    // get all barbers and users with mongodb ids that match the barberids
    let barbers = await Database.collection("Barbers").find({ _id: { $in: barberids.map((id: any) => mongodb.ObjectId(id)) } }).toArray();
    let users = await Database.collection("Users").find({}).toArray();
    // add the barbers to the appointments
    appointments = appointments.map((appointment: any) => {
      let barberUsername = barbers.find((barber: any) => barber._id == appointment.barberid).username;
      let barberUser = users.find((user: any) => user.username == barberUsername);
      appointment.barber = barberUser.name; 
      appointment.user = users.find((user: any) => user._id == appointment.userid).name;
      return appointment;
    });
    return res.status(200).send(appointments);
  }    
  //get all appointments
  let appointments = await Database.collection("Appointments").find({}).toArray();
  appointments.barbername = await Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(appointments.barberid) }).name;
  return res.status(200).send(appointments);
});

//get a single appointment
/**
 * This endpoint returns a single appointment
 * @api {get} /api/v1/appointments/:appointmentid Get a single appointment
 * @apiName GetAppointment
 * @apiGroup Appointments
 * @apiVersion 1.0.0
 * @apiParam {String} appointmentid MongoDB Id of the appointment
 * @apiSuccess {String} [_id] MongoDB Id of the appointment
 * @apiSuccess {String} [date] Date of the appointment
 * @apiSuccess {String} [time] Time of the appointment
 * @apiSuccess {String} [userid] MongoDB UserID of the appointment
 * @apiSuccess {String} [barberid] MongoDB BarberID of the appointment
 * @apiSuccess {String} [service] Service and price of the appointment
 * @apiSuccessExample {json} Success:
 * {
    "_id": "633c4c2b59ebc524fe92cec6",
    "date": "2022-11-04",
    "time": "14:30",
    "userid": "6325d90f4584f7a57192113c",
    "barberid": "6325eb956aec9d26d37d7723",
    "service": "Haircut,5999",
    "cancelled": true
}
@apiErrorExample {json} Invalid ID:
  * {
  *   "message": "Invalid appointment id"
  * }
*/

app.get(apiVersion + '/appointments/:appointmentid', async (req: Request, res: Response) => {
  if (req.params.appointmentid) {
    if(!mongodb.ObjectID.isValid(req.params.appointmentid)){
      return res.status(400).json({message: "Invalid appointment id"});
    }
    const appointment = await Database.collection("Appointments").findOne({ _id: mongodb.ObjectId(req.params.appointmentid) });
    return  res.json(appointment);
  }
});


/**
 * This endpoint returns all barbers
 * @api {get} /api/v1/barbers Get all barbers
 * @apiName GetBarbers
 * @apiGroup Barbers
 * @apiVersion 1.0.0
 * @apiSuccess {String} [_id] MongoDB Id of the barber
 * @apiSuccess {String} [username] Username of the barber
 * @apiSuccess {String} [name] The name of the barber
 * @apiSuccess {Object[]} [services] Array of services and prices for the barber
 * @apiSuccess {String} [name] The name of the service offerend
 * @apiSuccess {String} [price] The price of the service
 * @apiSuccess {String} [description] A description of the service
 * @apiSuccessExample {json} Success:
 * [
    {
        "_id": "6325eb956aec9d26d37d7723",
        "username": "barber1",
        "name": "Maggi Klippari"
        "services": [
            {
                "name": "Haircut",
                "price": "4999",
                "description": "A nice enjoyable haircut and wash. "
            },
            {
                "name": "Shave",
                "price": "1499",
                "description": "A straight razor shave"
            }
        ],
    }
]
*/
app.get(apiVersion + '/barbers', async (req: Request, res: Response) => {
  //join barber.username on user.username, add user.name to barbers
  const barbers = await Database.collection("Barbers").find({}).toArray();
  const user = await Database.collection("Users").find({}).toArray();
  //iterate over barbers and add user.name to barber
  barbers.forEach((barber: any) => {
    barber.name = user.find((user: any) => user.username === barber.username).name;
  });
  return res.status(200).json(barbers);
  
});

/**
 * This endpoint returns a single barbers
 * @api {get} /api/v1/barbers/:barberid Get a barber
 * @apiName GetSingleBarber
 * @apiGroup Barbers
 * @apiVersion 1.0.0
 * @apiParam {String} barberid MongoDB Id of the barber
 * @apiSuccess {String} [_id] MongoDB Id of the barber
 * @apiSuccess {String} [username] Username of the barber
 * @apiSuccess {String} [name] The name of the barber
 * @apiSuccess {Object[]} [services] Array of services and prices for the barber
 * @apiSuccess {String} [services.name] The name of the service offerend
 * @apiSuccess {String} [services.price] The price of the service
 * @apiSuccess {String} [services.description] A description of the service
 * @apiSuccessExample {json} Success:
 *   {
        "_id": "6325eb956aec9d26d37d7723",
        "username": "barber1",
        "name": "Maggi Klippari"
        "services": [
            {
                "name": "Haircut",
                "price": "4999",
                "description": "A nice enjoyable haircut and wash. "
            },
            {
                "name": "Shave",
                "price": "1499",
                "description": "A straight razor shave"
            }
        ],
    }
*/
app.get(apiVersion + '/barbers/:barberid', async (req: Request, res: Response) => {
  if (req.params.barberid) {
    const barber = await Database.collection("Barbers").findOne({ _id: mongodb.ObjectId(req.params.barberid) });
    const user = await Database.collection("Users").findOne({ username: barber.username });
    barber.name = user.name;
    return  res.status(200).json(barber);
  }
});


//Post endpoint for users
/**
 * This endpoint creates a new user
 * @api {post} /api/v1/users Create a new user
 * @apiName CreateUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiBody {String} username The new user's username
 * @apiBody {String} name  The new user's full name
 * @apiBody {String} email The new user's email
 * @apiBody {String} password The new user's password
 * @apiBody {String} phone The new user's phone number
 * @apiSuccess {Boolean} [acknowledged] True if user creation successful 
 * @apiSuccess {String} [insertedId] MongoDB Id of the new user
 * @apiSuccess {String} [token] JWT token for the new user for automatic login after registration 
 * @apiSuccessExample {json} Success:
 * {
    "acknowledged": true,
    "insertedId": "635e8d35ea58f2429520cea6",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJ1c2VyaWQiOiI2MzVlOGQzNWVhNThmMjQyOTUyMGNlYTYiLCJpYXQiOjE2NjcxNDA5MTcsImV4cCI6MTY2OTczMjkxN30.xpInW58ecX0zcnD2CRUqwp5PSLpEdPcnv8kF7zxpGlM"
}
@apiErrorExample {json} Body missing error:
  * {
    "message": "Invalid body"
  }
@apiErrorExample {json} Username taken error:
  * {
    "message": "Username already exists"
  }
@apiErrorExample {json} Missing field error:
  * {
    "message": "Bad request. Request needs to contain name, username, email, password and phone."
  }
@apiErrorExample {json} Invalid field error:
  * {
    "message": "Bad request. Request needs to contain name, username, email, password and phone, cannot be empty."
  }
*/
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

//Patch endpoint for users
/**
 * This endpoint creates a new user
 * @api {patch} /api/v1/users Edit a user's information
 * @apiName EditUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiBody {String} [name]  The user's new full name
 * @apiBody {String} [email] The user's new email
 * @apiBody {String} [phone] The new user's new phone number
 * @apiSuccess {Boolean} [acknowledged] True if user creation successful 
 * @apiSuccess {Integer} [modifiedCount] Should be 1 if user was updated
 * @apiSuccess {String} [usertedId] Should be null if user was updated
 * @apiSuccess {Integer} [upsertedCount] Should be 0 if user was updated
 * @apiSuccess {Integer} [matchedCount] Should be 1 if user was updated
 * @apiSuccessExample {json} Success:
 * {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
* @apiErrorExample {json} User with userID not found:
* {
    "message": "User does not exist."
}
* @apiErrorExample {json} Request body did not contain any fields to update:
* {
    "message": "Bad request. Request needs to contain name, email or phone."
}
* @apiErrorExample {json} userID is invalid:
* {
    "message": "Invalid user id."
}
* @apiErrorExample {json} Body is empty:
* {
    "message": "Invalid body."
}

*/
app.patch(apiVersion + '/users/:userid', async (req: Request, res: Response) => {
  //check if body is not null
  //empty json object
  if (req.body == null || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Invalid body' });
  }
  //body needs at least one of the following fields
  if (req.body.name == null && req.body.email == null && req.body.phone == null) {
    return res.status(400).json({message: "Bad request. Request needs to contain name, email or phone."});
  }
  //check if userid is valid
  if(!mongodb.ObjectID.isValid(req.params.userid)){
    return res.status(400).json({message: "Invalid user id"});
  }
  //check if user exists
  const user = await Database.collection("Users").findOne({ _id: mongodb.ObjectId(req.params.userid) });
  if (user == null) {
    return res.status(400).json({message: "User does not exist."});
  }
  //check if user is trying to change username
  if (req.body.username != null) {
    return res.status(400).json({message: "Cannot change username."});
  }
  //check if user is trying to change password
  if (req.body.password != null) {
    return res.status(400).json({message: "Cannot change password."});
  }
  //update user and return the result
  const User = await Database.collection("Users").updateOne({ _id: mongodb.ObjectId(req.params.userid) }, { $set: req.body });
  return res.status(200).json(User);
});




//Post endpoint for appointments
/**
 * This endpoint creates a new appointment. Appointments can only be booked every 30 minutes.
 * @api {post} /api/v1/appointments Create a new appointment
 * @apiName CreateAppointment
 * @apiGroup Appointments
 * @apiVersion 1.0.0
 * @apiBody {String} barberid  The barber with whom the appointment is with
 * @apiBody {String} userid The user who is making the appointment
 * @apiBody {String} date The date of the appointment
 * @apiBody {String} time The time of the appointment
 * @apiBody {String} service The service the user is getting at the appointment
 * @apiSuccess {String} [id] The id of the appointment
 * @apiSuccessExample {json} Success:
 * {
    "acknowledged": true,
    "insertedId": "635ea1203643dd07a1bb9303"
  }
* @apiErrorExample {json} Barber with invalid barberID:
* {
    "message": "Barber does not exist."
}
* @apiErrorExample {json} User with invalid userID:
* {
    "message": "User does not exist."
}
* @apiErrorExample {json} Request body did not contain all required fields:
* {
  "message": "Bad request. Request needs to contain barber, date, time, userid and service."
}
* @apiErrorExample {json} Time is not in the correct format:
* {
  "message": "Time is not in the correct format. Correct format is HH:MM"
}
* @apiErrorExample {json} Date is not in the correct format:
* {
  "message": "Date is not in the correct format. Correct format is YYYY-MM-DD"
}
* @apiErrorExample {json} Date is in the past:
* {
  "message": "Date is in the past."
}
* @apiErrorExample {json} Time not in 30 minute increments:
* {
  "message": "Appointments can only be booked in 30 minute intervals."
}
 */
app.post(apiVersion + '/appointments', async (req: Request, res: Response) => {
  //check if body is not null
  if (req.body == null || Object.keys(req.body).length === 0) {
    return res.status(400).json({ message: 'Invalid body' });
  }
  //check if body has all the required fields
  if (req.body.barberid == null || req.body.date == null || req.body.time == null || req.body.userid == null || req.body.service == null) {
    return res.status(400).json({message: "Bad request. Request needs to contain barber, date, time, userid and service."});
  }
  //check if barber exists using mongoDB id
  //check if id is valid id
  if (!mongodb.ObjectId.isValid(req.body.barberid)) {
    return res.status(400).json({message: "Barber does not exist."});
  }
  const barber = await Database.collection("Barbers").findOne({_id: mongodb.ObjectId(req.body.barberid)});
  if (barber == null) {
    return res.status(400).json({message: "Barber does not exist."});
  }

  //check if barber is busy at this time and date.
  const appointment = await Database.collection("Appointments").findOne({barberid: req.body.barberid, date: req.body.date, time: req.body.time});
  if (appointment != null) {
    return res.status(400).json({message: "Barber already has an appointment at this date/time."});
  }
  //check if id is valid id
  if (!mongodb.ObjectId.isValid(req.body.userid)) {
    return res.status(400).json({message: "User does not exist."});
  }
  //check if customer exists using mongoDB id
  const user = await Database.collection("Users").findOne({_id: mongodb.ObjectId(req.body.userid)});
  if (user == null) {
    return res.status(400).json({message: "User does not exist."});
  }
  //check formatting of date and time
  if (!req.body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({message: "Date is not in the correct format. Correct format is YYYY-MM-DD"});
  }
  if (!req.body.time.match(/^\d{2}:\d{2}$/)) {
    return res.status(400).json({message: "Time is not in the correct format. Correct format is HH:MM"});
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
  if(time[0] < 0 || time[0] > 24) {
    return res.status(400).json({message: "Time is not in the correct format. Correct format is HH:MM"});
  }
  //create appointment and insert into database, then return the result
  const Appointments = await Database.collection("Appointments").insertOne(req.body);
  Appointments.barbername = barber.name;
  return res.status(200).json(Appointments);
});

//post endpoint for barbers, takes in a username and generates a barber
/** This endpoint creates a new barber, from an existing user.
 *  @api {post} /api/v1/barbers Create a new barber
 *  @apiName CreateBarber
 *  @apiGroup Barbers
 *  @apiVersion 1.0.0
 *  @apiBody {String} username The username of the user who is becoming a barber
 *  @apiBody {Object[]} services The services the barber provides
 *  @apiBody {String} services.name The name of the service
 *  @apiBody {Integer} services.price The price of the service
 *  @apiBody {String} services.description The description of the service
 *  @apiSuccess {Boolean} [acknowledged] True if the barber was created successfully
 *  @apiSuccess {String} [insertedId] The id of the barber
 *  @apiSuccessExample {json} Success:
 *  {
    "acknowledged": true,
    "insertedId": "635ea331f91c27f4fa78f0c8"
}
* @apiErrorExample {json} User with invalid username:
* {
    "message": "No user with this username"
}
* @apiErrorExample {json} Request body did not contain all required fields:
* {
  "message": "Bad request. Request needs to contain a username. All barbers must have at least one service."
}
* @apiErrorExample {json} Request body empty:
* {
  "message": "Invalid body"
}
* @apiErrorExample {json} User is already a barber:
* {
  "message": "This user is already a barber."
}
* @apiErrorExample {json} Service isn't an array:
* {
  "message": "Bad request. Services needs to be an array."
}
* @apiErrorExample {json} Service arry does not contain all required fields:
* {
  "message": "Bad request. Services needs to be an array of objects with name and price fields."
}
 */
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


/** This endpoint logs in a user.
 * @api {post} /api/v1/login Login a user
 * @apiName LoginUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiBody {String} username The username of the user
 * @apiBody {String} password The password of the user
 * @apiSuccess {String} [token] The token of the user
 * @apiSuccessExample {json} Success:
 * {
 *  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im9saXN0YXJyaSIsInVzZXJpZCI6IjYzMjVkOTBmNDU4NGY3YTU3MTkyMTEzYyIsImlzQmFyYmVyIjpmYWxzZSwiaWF0IjoxNjY2MTA3NjE3LCJleHAiOjE2Njg2OTk2MTd9.ZqDsRv8C7_IJ8glMlnCxZk3tw9Olgsxw2Jg0O2zz7iU"
 * }
 * @apiErrorExample {json} Body is empty:
 * {
 * "message": "Invalid body"
 * }
 * @apiErrorExample {json} User does not exist:
 * {
 *  "message": "Invalid username or password."
 * }
 * @apiErrorExample {json} Password is incorrect:
 * {
 * "message": "Invalid username or password."
 * }
 * @apiErrorExample {json} Body does not contain all required fields:
 * {
 * "message": "Bad request. Request needs to contain username and password."
 * }
 */
app.post(apiVersion + "/login", async (req: Request, res: Response) => {
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
      // Check if the username is a barber
      const barber = await Database.collection("Barbers").findOne({username: req.body.username});
      if (barber != null) {
        const token = jwt.sign({username: user.username, userid: user._id, isBarber:true, barberid:barber._id}, JWT_SECRET, {expiresIn: "30d"});
        return res.status(200).json({token: token});
      }
      const token = jwt.sign({username: user.username, userid: user._id,isBarber:false}, JWT_SECRET, {expiresIn: "30d"});
      return res.status(200).json({token: token});
      //create a token for the user
    }

   
});

/** This endpoint deletes a barbers.
 * @api {delete} /api/v1/barbers/:id Delete a barber
 * @apiName DeleteBarber
 * @apiGroup Barbers
 * @apiVersion 1.0.0
 * @apiParam {String} id The id of the barber to delete
 * @apiSuccess {Boolean} [acknowledged] True if the barber was deleted
 * @apiSuccess {Number} [deletedCount] The number of barbers deleted, should be 1
 * @apiSuccessExample {json} Success:
 * {
 *   "acknowledged": true,
 *   "deletedCount": 1
 *}
 * @apiErrorExample {json} Barberid is not given:
 * {
 * "message": "Invalid id"
 * }
 * @apiErrorExample {json} Barber does not exist:
 * {
 *  "acknowledged": true,
 *  "deletedCount": 0
 *}
*/
app.delete(apiVersion + '/barbers/:id', async (req: Request, res: Response) => {
  //check if id is not null
  if (req.params.id == null) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  //delete barber and return the result
  const Barbers:JSON = await Database.collection("Barbers").deleteOne({_id: mongodb.ObjectId(req.params.id)});
  return res.status(200).json(Barbers);
});


/** This endpoint deletes a user.
 * @api {delete} /api/v1/users/:id Delete a user
 * @apiName DeleteUser
 * @apiGroup Users
 * @apiVersion 1.0.0
 * @apiParam {String} id The id of the user to delete
 * @apiSuccess {Boolean} [acknowledged] True if the user was deleted
 * @apiSuccess {Number} [deletedCount] The number of users deleted, should be 1
 * @apiSuccessExample {json} Success:
 * {
 *   "acknowledged": true,
 *   "deletedCount": 1
 *}
 * @apiErrorExample {json} Userid is not given:
 * {
 * "message": "Invalid id"
 * }
 * @apiErrorExample {json} User does not exist:
 * {
 *  "acknowledged": true,
 *  "deletedCount": 0
 *}
*/
app.delete(apiVersion + '/users/:id', async (req: Request, res: Response) => {
  //check if id is not null
  if (req.params.id == null) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  //delete user and return the result
  const Users:JSON = await Database.collection("Users").deleteOne({_id: mongodb.ObjectId(req.params.id)});
  return res.status(200).json(Users);
});


/** This endpoint deletes an appointment.
 * @api {delete} /api/v1/appointments/:id Delete an appointment
 * @apiName DeleteAppointment
 * @apiGroup Appointments
 * @apiVersion 1.0.0
 * @apiParam {String} id The id of the appointment to delete
 * @apiSuccess {Boolean} [acknowledged] True if the appointment was deleted
 * @apiSuccess {Number} [deletedCount] The number of appointments deleted, should be 1
 * @apiSuccessExample {json} Success:
 * {
 *  "acknowledged": true,
 * "deletedCount": 1
 * }
 * @apiErrorExample {json} Appointmentid is not given:
 * {
 * "message": "Invalid id"
 * }
 * @apiErrorExample {json} Appointment does not exist:
 * {
 * "message": "No appointment with this id"
 * }
 * @apiErrorExample {json} Appointment is not in the future:
 * {
 * "message": "Cannot delete appointments in the past."
 * }
 */
app.delete(apiVersion + '/appointments/:id', async (req: Request, res: Response) => {
  //check if id is not null and valid mongodb id
  if (req.params.id == null || req.params.id == "" || !mongodb.ObjectId.isValid(req.params.id)) { 
    return res.status(400).json({ message: 'Invalid id' });
  }
  //if the appointment is in the future, delete appointment and return the result
  const appointment = await Database.collection("Appointments").findOne({_id: mongodb.ObjectId(req.params.id)});
  if (appointment == null) {
    return res.status(400).json({message: "No appointment with this id"});
  }
  //parse date from string
  const currentDate = new Date(appointment.date);
  if (currentDate > new Date()) {
  const Appointments:JSON = await Database.collection("Appointments").deleteOne({_id: mongodb.ObjectId(req.params.id)});
  return res.status(200).json(Appointments);
  }
  else {
    return res.status(400).json({message: "Cannot delete appointments in the past."});
  }
});

/** This endpoint handles notifications for users.
 * If the user has an appointment that needs rescheduling, the user will receive a notification.
 * @api {get} /api/v1/notifications/ Get notifications for a user
 * @apiName GetNotifications
 * @apiGroup Notifications
 * @apiVersion 1.0.0
 * @apiHeader {String} Authorization The authorization token
 * @apiSuccess {String} [message] The message of the notification
 * @apiSuccessExample {json} Notification for user:
 * {
 *  "message":"Your appointment with Siggi Rakari on 2022-05-20 needs rescheduling."
 * }
 * @apiSuccessExample {json} Notification for barber:
 * {
 * "message":"Your appointment with Ólafur on 2022-05-20 has been cancelled."
 * }
 * @apiSuccessExample {json} No notification for user:
 * {
 * []
 * }
 * @apiErrorExample {json} Invalid or missing token:
 * {
 * "message": "Unauthorized"
 * }
 */ 
app.get(apiVersion + '/notifications', async (req: Request, res: Response) => {
  // check if the user is logged in
  const token = req.headers.authorization;
  if (token == null) {
    return res.status(401).json({message: "Unauthorized"});
  }
  // check if the token is valid
  //check if jwt is malformed
  const decoded = jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return null;
    }
    return decoded;
  });
  if (decoded == null) {
    return res.status(401).json({message: "Unauthorized"});
  }
  // check if an appointment has the flag cancelled set to true or if the appointment needs rescheduling(needsRescheduling set to true)
  // if decoded.isBarber is true, then we need to check if the barber has any appointments with the flag set to true
  // if decoded.isBarber is false, then we need to check if the user has any appointments with the flag set to true
  let appointments = null;
  if (decoded.isBarber) {
    appointments = await Database.collection("Appointments").find({barberid: decoded.barberid, $or: [{needsRescheduling: true}]}).toArray();
  }
  else {
    appointments = await Database.collection("Appointments").find({userid: decoded.userid, $or: [{needsRescheduling: true}]}).toArray();
  }
  if (appointments == null) {
    return res.status(200).json([]);
  }


  // get barbername from each barberid in appointments
  let barberids = [];
  let userids = [];
  appointments.forEach(appointment => {
    barberids.push(appointment.barberid);
    userids.push(appointment.userid);
  });
  //get all barbers and join user.username from collection "Users" on barber.username and add user.name to barber as name aggregate
  const barbers = await Database.collection("Barbers").aggregate([
    {$lookup: {from: "Users", localField: "username", foreignField: "username", as: "user"}},
    {$addFields: {name: "$user.name"}}
  ]).toArray();
  const users = await Database.collection("Users").find({}).toArray();
  
  
  // add all notifications to an array and return it
  // The notifications should say the client's name if the notifications are being requested by a barber
  // The notifications should say the barber's name if the notifications are being requested by a client
  let notifications = [];
  if (appointments != null) {

    for (let i = 0; i < appointments.length; i++) {

      let name = "";
      if(decoded.isBarber) {  // if the user is a barber, then we need to get the name of the user
        // find username
        users.filter(user => {
          if (user._id == appointments[i].userid) {
            name = user.name;
          }
        });

      } else {  // if the user is a user, then we need to get the name of the barber
        // find barber name
        barbers.filter(barber => {
          if (barber._id == appointments[i].barberid) {
            //find user with same username as barber
            name = barber.name;
          }
        });
      }

      if(appointments[i].needsRescheduling == true) 
        notifications.push({message: "Your appointment with " + name + " on " + appointments[i].date + " needs rescheduling."});
      
      else if (appointments[i].cancelled == true && (appointments[i].ack == false || appointments[i].ack == null)) 
        notifications.push({message: "Your appointment with " + name + " on " + appointments[i].date + " has been cancelled."});
      
    }

  }
  // return the notifications
  return res.status(200).json(notifications);
});
  
/** This endpoint handles modifications to appointments, such as rescheduling and cancelling.
 * @api {put} /api/v1/appointments/:id Modify an appointment
 * @apiName ModifyAppointment
 * @apiGroup Appointments
 * @apiVersion 1.0.0
 * @apiParam {String} id The id of the appointment
 * @apiBody {Boolean} [cancelled] Cancels the appointment if set to true
 * @apiBody {Boolean} [needsRescheduling] Flags the appointment as needing rescheduling if set to true
 * @apiBody {String} [date] The new date of the appointment
 * @apiBody {String} [time] The new time of the appointment
 * @apiSuccess {Boolean} [acknowledged] True if the appointment was found
 * @apiSuccess {Integer} [modifiedCount] The number of appointments modified, should be 1
 * @apiSuccess {Integer} [upsertedId]  The new id of the appointment that was modified, should be null
 * @apiSuccess {Integer} [upsertedCount] The number of appointments upserted, should be 0
 * @apiSuccess {Integer} [matchedCount] The number of appointments matched, should be 1
 * @apiSuccessExample {json} Appointment cancelled:
 * {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 1
}
  * @apiSuccessExample {json} Appointment rescheduled:
  * {
  * "acknowledged": true,
  * "modifiedCount": 1,
  * "upsertedId": null,
  * "upsertedCount": 0,
  * "matchedCount": 1
  * }
  * @apiErrorExample {json} No id provided:
  * {
  *   "message": "Invalid id"
  * }
  * @apiErrorExample {json} Invalid id:
  * {
  *  "message": "No appointment with this id"
  * }
  * @apiErrorExample {json} Date is invalid:
  * {
  * "message": "Date is not in the correct format. Correct format is YYYY-MM-DD"
  * }
  * @apiErrorExample {json} Time is invalid:
  * {
  * "message": "Time is not in the correct format. Correct format is HH:MM"
  * }
  * @apiErrorExample {json} Time unavailable:
  * {
  * "message": "Appointments can only be booked in 30 minute intervals."
  * }
  * @apiErrorExample {json} Canceling appointment in the past:
  * {
  * "message": "Cannot cancel appointments in the past."
  * }
 */ 
app.patch(apiVersion + '/appointments/:id', async (req: Request, res: Response) => {
  //check if id is not null and valid mongodb id
  if (req.params.id == null || req.params.id == "" || !mongodb.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id' });
  }
  //check if the appointment is in the future
  const appointment = await Database.collection("Appointments").findOne({_id: mongodb.ObjectId(req.params.id)});
  if (appointment == null) {
    return res.status(400).json({message: "No appointment with this id"});
  }
  // if appointment has been cancelled, and the body includes ack = true, then add ack = true to the appointment
  if (appointment.cancelled == true && req.body.ack == true) {
    const Appointments:JSON = await Database.collection("Appointments").updateOne({_id: mongodb.ObjectId(req.params.id)}, {$set: {ack: true}});
    return res.status(200).json(Appointments);
  }   ////////////////////////////////////////////// Needs to be checked and tested. Might not be the best way to do it.
  ////////// Might want to have it such that when a user acknowledges a cancellation, ack increments by 1, and when a barber acknowledges a cancellation, ack increments by 2.
  ///////// That way we can track weather both the user and the barber have acknowledged the cancellation.
  ///////// This is useful for us so we can keep track of who cancelled the appointemnt. (Ack = 1 would be included in the cancellation request if the user cancelled the appointment, and ack = 2 would be included in the cancellation request if the barber cancelled the appointment)
  ///////// That way we can filter out appointments cancelled by the user from his notifications, and only show the barber the cancellation notification. and vice versa.
  //parse date from string
  let currentDate = new Date(appointment.date + " " + appointment.time);
  if (currentDate >= new Date()) {

    if(req.body.cancelled == true) {  // If the appointment is cancelled, set the cancelled flag to true and set the needsRescheduling flag to false
      const Appointments:JSON = await Database.collection("Appointments").updateOne({_id: mongodb.ObjectId(req.params.id)}, {$set: {cancelled: true, needsRescheduling: false}});
      return res.status(200).json(Appointments);
    }

    else if (req.body.needsRescheduling == true) { // If the appointment needs rescheduling, set the needsRescheduling flag to true
      const Appointments:JSON = await Database.collection("Appointments").updateOne({_id: mongodb.ObjectId(req.params.id)}, {$set: {needsRescheduling: true}});
      return res.status(200).json(Appointments);
    }

    else if (req.body.needsRescheduling == false) { // If the appointment has been rescheduled, set the needsRescheduling flag to false and set the date to the new date
      let newdate = req.body.date 
      let newtime = req.body.time
       //check formatting of date and time
      if (!newdate.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return res.status(400).json({message: "Date is not in the correct format. Correct format is YYYY-MM-DD"});
      }
      // check if time is in the correct format
      if (!newtime.match(/^\d{2}:\d{2}$/)) { 
        return res.status(400).json({message: "Time is not in the correct format. Correct format is HH:MM"});
      }
      // check if the time is in 30 minute intervals
      const time = req.body.time.split(":");
      if (time[1] != "00" && time[1] != "30") {
        return res.status(400).json({message: "Appointments can only be booked in 30 minute intervals."}); //maybe change this to 15 minute intervals if appointments are 45 mins.. 
      }
      // check if the date is valid
      if (newdate == null || new Date(newdate) < new Date()) { // If the date is null or in the past return an error
        return res.status(400).json({message: "Invalid date"});
      }
      // remove the needsRescheduling flag and update the date and time
      const Appointments:JSON = await Database.collection("Appointments").updateOne({_id: mongodb.ObjectId(req.params.id)}, {$set: {needsRescheduling: false, date: newdate, time: newtime}});
      return res.status(200).json(Appointments);  // return the result
    }

    else { // If the request body is invalid, return an error
      return res.status(400).json({message: "Invalid request"});
    }
  }
  else { // If the appointment is in the past, return an error
    return res.status(400).json({message: "Cannot cancel appointments in the past."});
  }
});

/** This endpoint is used by barbers to book a holiday, if an appointment is booked during a holiday, the appointment is cancelled and the user is notified.
 * At that point the user can either fully cancel their appointment or rechedule it. No further appointments can be booked during the holiday.
 * @api {post} /api/v1/holidays/ Create a holiday
 * @apiName CreateHoliday
 * @apiGroup Holidays
 * @apiVersion 1.0.0
 * @apiHeader {String} Authorization The authorization token.
 * @apiBody {String} date The date of the holiday.
 * @apiSuccess {String} [acknowledged] True if the holiday has been booked.
 * @apiSuccess {Integer} [modifiedCount] The number of appointments that were cancelled.
 * @apiSuccess {Integer} [upsertedId] Should be null.
 * @apiSuccess {Integer} [upsertedCount] Should be 0.
 * @apiSuccess {Integer} [matchedCount] The number of appointments that were found on that date.
 * @apiSuccessExample {json} Success:
 * {
    "acknowledged": true,
    "modifiedCount": 1,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 0
}
 * 
 * @apiErrorExample {json} Invalid/missing token:
 * {
 * "message": "Invalid token"
 * }
 * @apiErrorExample {json} Invalid/incorrect date format:
 * {
 * "message": "Invalid date"
 * }
 * @apiErrorExample {json} Barber already has a holiday on this date:
 * {
 * "message": "Holiday already exists"
 * }
 * @apiErrorExample {json} Date is in the past:
 * {
 * "message": "Invalid date"
 * }
 * @apiErrorExample {json} User is not a barber:
 * {
 * "message": "Invalid token"
 * }
 */
app.post(apiVersion + '/holiday', async (req: Request, res: Response) => {
  //check if token is valid
  if (req.headers.authorization == null || req.headers.authorization == "") {
    return res.status(401).json({ message: 'Invalid token' });
  }
  //decode token
  const token = req.headers.authorization;
  const decoded = jwt.verify(token, JWT_SECRET);
  if(decoded == null) {
    return res.status(401).json({ message: 'Invalid token' });
  }
  //check if the user is a barber
  if(decoded.isBarber) {
    //check if the date is valid
    if (req.body.date == null || req.body.date == "" || !req.body.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return res.status(400).json({ message: 'Invalid date' });
    }
    // if day has already been added, return an error
    const holiday = await Database.collection("Daysoff").findOne({date: req.body.date, barberId: decoded.id});
    if (holiday != null) {
      return res.status(400).json({message: "Holiday already exists"});
    }
    const now = new Date();
    //if the date is today, cancel all appointments after the current time
    // add the holiday to the holidays collection
    if (req.body.date == now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()) {
      // do not add needsRescheduling flag to appointments that have already been cancelled or cancelled does not exist
      //const Appointments:JSON = await Database.collection("Appointments").updateMany({barberId: decoded.id, date: req.body.date, time: {$gte: now.getHours() + ":" + now.getMinutes()}, cancelled: {$ne: true}}, {$set: {needsRescheduling: true}});
      const Appointments:JSON = await Database.collection("Appointments").updateMany({date: req.body.date, time: {$gt: now.getHours() + ":" + now.getMinutes()}, barberid: decoded.barberid, cancelled: {$ne: true}}, {$set: {needsRescheduling: true}});
      await Database.collection("Daysoff").insertOne({date: req.body.date, barberid: decoded.barberid});
      return res.status(200).json(Appointments);
    }
    //if the date is in the future, cancel all appointments
    else if (req.body.date > now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate()) {
      // do not add needsRescheduling flag to appointments that have already been cancelled or cancelled does not exist
      const Appointments:JSON = await Database.collection("Appointments").updateMany({date: req.body.date, barberid: decoded.barberid, cancelled: {$ne: true}}, {$set: {needsRescheduling: true}});
      await Database.collection("Daysoff").insertOne({date: req.body.date, barberid: decoded.barberid});
      return res.status(200).json(Appointments);
    }
    //if the date is in the past, return an error
    else {
      return res.status(400).json({ message: 'Invalid date' });
    }
  }
  //if the user is not a barber, return an error
  else {
    return res.status(401).json({ message: 'Unauthorized' });
  }
});
    
/** This endpoint is used by barbers to delete a holiday. This allowes users to book appointments on that day again.
 * @api {delete} /api/v1/holidays/ Delete a holiday
 * @apiName DeleteHoliday
 * @apiGroup Holidays
 * @apiVersion 1.0.0
 * @apiBody {String} date The date of the holiday.
 * @apiBody {String} barberid The id of the barber whos holiday we are deleting.
 * @apiSuccess {String} [acknowledged] True if the holiday has been deleted.
 * @apiSuccess {Integer} [modifiedCount] The number of holidays that were cancelled.
 * @apiSuccess {Integer} [upsertedId] Should be null.
 * @apiSuccess {Integer} [upsertedCount] Should be 0.
 * @apiSuccess {Integer} [matchedCount] The number of holidays that were found on that date.
 * @apiSuccessExample {json} Success:
 * {
 * "acknowledged": true,
 * "modifiedCount": 1,
 * "upsertedId": null,
 * "upsertedCount": 0,
 * "matchedCount": 0
 * }
 * @apiErrorExample {json} Body is empty:
 * {
 * "message": "Invalid request"
 * }
 * @apiErrorExample {json} Date is missing/invalid:
 * {
 * "message": "Invalid date"
 * }
 * @apiErrorExample {json} Barberid is missing/invalid:
 * {
 * "message": "Invalid barberid"
 * }
 * @apiErrorExample {json} Barber does not have a holiday on this date:
 * {
 * "message": "Holiday does not exist"
 * }
 * 
 */
app.delete(apiVersion + '/holiday', async (req: Request, res: Response) => {
  // get json object with date and barberid
  const holiday = req.body;
  if(holiday == null) {
    return res.status(400).json({message: "Invalid request"});
  }
  if (holiday.date == null || holiday.date == "" || !holiday.date.match(/^\d{4}-\d{2}-\d{2}$/)) {
    return res.status(400).json({ message: 'Invalid date' });
  }
  if (holiday.barberid == null || holiday.barberid == "") {
    return res.status(400).json({ message: 'Invalid barberid' });
  }
  // remove holiday from the holidays collection
  const result = await Database.collection("Daysoff").deleteOne({date: holiday.date, barberid: holiday.barberid});
  if (result.deletedCount == 0) {
    return res.status(400).json({message: "Holiday does not exist"});
  }
  return res.status(200).json(result);
});
  
  

app.listen(port, () => {
  return console.log(`Barbershop site is available on http://localhost:${port}`);
});