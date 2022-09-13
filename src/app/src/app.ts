import express from 'express';
import path from 'path';
const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, '/../pages/')));

app.get('/', (req, res) => {
  // send index.html from pages
  //res.sendFile('../pages/index.html')
  //res.send('Hello World!');
});

app.listen(port, () => {
  return console.log(`Express is listening at http://localhost:${port}`);
});