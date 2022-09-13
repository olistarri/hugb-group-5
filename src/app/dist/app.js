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
const app = (0, express_1.default)();
const port = 3000;
app.use(express_1.default.static(path_1.default.join(__dirname, '/../pages/')));
const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
const URI = "mongodb+srv://Demo:Nsi8yQYWYYQXc5GM@hugb-hopur5.59nlce1.mongodb.net/BarberShop?retryWrites=true&w=majority";
const client = new MongoClient(URI, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect();
const Database = client.db("BarberShop");
app.get('/Users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Users").find({}).toArray();
    return res.status(200).json(Users);
}));
app.get('/Appointments', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Appointments").find({}).toArray();
    return res.status(200).json(Users);
}));
app.get('/Barbers', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const Users = yield Database.collection("Barbers").find({}).toArray();
    return res.status(200).json(Users);
}));
app.listen(port, () => {
    return console.log(`Express is listening at http://localhost:${port}`);
});
//# sourceMappingURL=app.js.map