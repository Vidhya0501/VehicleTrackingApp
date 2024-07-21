const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();


app.use(cors());
dotenv.config();

const vehicleData = require('./data/vehicleData.json');

app.get('/api/vehicle-location', (req, res) => {
  res.json(vehicleData);
});

port = process.env.PORT; 

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
