import express, { Request, Response } from 'express';
import path from 'path';
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../pages/')));

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority"
const client = new MongoClient(URI,{ useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop")


app.get('/Users', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Users").find({}).toArray();
  return res.status(200).json(Users);
});


app.get('/Appointments', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Appointments").find({}).toArray();
  return res.status(200).json(Users);
});

app.get('/Barbers', async (req: Request, res: Response) => {
  const Users:JSON = await Database.collection("Barbers").find({}).toArray();
  return res.status(200).json(Users);
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});