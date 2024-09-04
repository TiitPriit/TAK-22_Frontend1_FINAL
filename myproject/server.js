const express = require('express');
const app = express();
const port = 3004;

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});

const jwt = require('jsonwebtoken');
const secretKey = 'tiitpriit';

function verifyToken(req, res, next) {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ auth: false, message: 'No token provided.' });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
    }


    req.userId = decoded.id;
    next();
  });
}
app.get('/token', (req, res) => {
    const payload = { id: 1 };
    const token = jwt.sign(payload, secretKey, {
      expiresIn: 86400
    });
  
    res.status(200).send({ auth: true, token: token });
  });
  app.get('/protected', verifyToken, (req, res) => {
    res.status(200).send({ message: 'You have accessed a protected route!' });
  });
  const axios = require('axios');

app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = '38ff2679376092d68b306729ae01d646';

  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    res.send(response.data);
  } catch (error) {
    console.error(error); // log the error
    res.status(500).send({ message: 'Error retrieving weather data' });
  }
});