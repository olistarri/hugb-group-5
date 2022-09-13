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
    //check if body is valid
    if (req.body == null) {
        console.log(req);
        return res.status(400).json({ message: 'Invalid body' });
    }
    if (req.body.name == null || req.body.username == null || req.body.email == null || req.body.password == null || req.body.phone == null) {
        return res.status(400).json({ message: "Bad request" });
    }
    const Users = yield Database.collection("Users").insertOne(req.body);
    return res.status(200).json(Users);
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map