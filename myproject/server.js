const express = require('express');
const app = express();
const port = 3007;

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
  const apiKey = '32056790a7c14d577697c48469ac5291';

  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    res.send(response.data);
  } catch (error) {
    console.error(error); // log the error
    res.status(500).send({ message: 'Error retrieving weather data' });
  }
});
let todos = []; // This will be your "database" for now

app.post('/todos', verifyToken, (req, res) => {
  const todo = {
    id: todos.length + 1,
    title: req.body.title,
    description: req.body.description,
    status: req.body.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  todos.push(todo);
  res.status(201).json(todo);
});

app.get('/todos', verifyToken, (req, res) => {
  res.json(todos);
});

app.get('/todos/:id', verifyToken, (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

app.put('/todos/:id', verifyToken, (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  todo.title = req.body.title;
  todo.description = req.body.description;
  todo.status = req.body.status;
  todo.updatedAt = new Date();
  res.json(todo);
});

app.delete('/todos/:id', verifyToken, (req, res) => {
  const index = todos.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });
  todos.splice(index, 1);
  res.status(204).end();
});