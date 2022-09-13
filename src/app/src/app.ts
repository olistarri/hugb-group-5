import express, { Request, Response } from 'express';
import path from 'path';
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../pages/')));
app.use(bodyParser.json());

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority"
const client = new MongoClient(URI,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop")
const apiVersion = "/api/v1"

app.get(apiVersion + '/users', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Users").find({}).toArray();
  return res.status(200).json(Users);
});


app.get(apiVersion + 'api/appointments', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Appointments").find({}).toArray();
  return res.status(200).json(Users);
});

app.get(apiVersion + 'api/barbers', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Barbers").find({}).toArray();
  return res.status(200).json(Users);
});

//Post endpoint for users
app.post(apiVersion + '/users', async (req: any, res: Response) => {
  //check if body is valid
  if (req.body == null) {
    console.log(req);
    return res.status(400).json({ message: 'Invalid body' });
  }
  if (req.body.name == null || req.body.username == null || req.body.email == null || req.body.password == null || req.body.phone == null) {
    return res.status(400).json({message: "Bad request. Request needs to contain name, username, email, password and phone."});
  }
  const Users:JSON = await Database.collection("Users").insertOne(req.body);
  return res.status(200).json(Users);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});