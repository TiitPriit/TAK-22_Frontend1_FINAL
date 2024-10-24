const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const app = express();
const port = 3007;
const secretKey = 'tiitpriit';

// Middleware
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(cors()); // Enable Cross-Origin Resource Sharing

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

// Middleware to verify JWT token
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

// Endpoint to generate a token
app.get('/token', (req, res) => {
  const payload = { id: 1 };
  const token = jwt.sign(payload, secretKey, {
    expiresIn: 86400 // Token expires in 24 hours
  });

  res.status(200).send({ auth: true, token: token });
});

// Protected route example
app.get('/protected', verifyToken, (req, res) => {
  res.status(200).send({ message: 'You have accessed a protected route!' });
});

// Endpoint to get weather data for a city
app.get('/weather/:city', async (req, res) => {
  const city = req.params.city;
  const apiKey = '32056790a7c14d577697c48469ac5291';

  console.log('Received weather request for city:', city); // Debugging log

  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`);
    console.log('Weather API response:', response.data); // Debugging log
    res.send(response.data);
  } catch (error) {
    console.error('Error retrieving weather data:', error); // Debugging log
    res.status(500).send({ message: 'Error retrieving weather data' });
  }
});

// In-memory "database" for TODOs
let todos = [];

// Create a new TODO
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

// Get all TODOs
app.get('/todos', verifyToken, (req, res) => {
  res.json(todos);
});

// Get a specific TODO by ID
app.get('/todos/:id', verifyToken, (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.json(todo);
});

// Update a specific TODO by ID
app.put('/todos/:id', verifyToken, (req, res) => {
  const todo = todos.find(t => t.id === Number(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  todo.title = req.body.title;
  todo.description = req.body.description;
  todo.status = req.body.status;
  todo.updatedAt = new Date();
  res.json(todo);
});

// Delete a specific TODO by ID
app.delete('/todos/:id', verifyToken, (req, res) => {
  const index = todos.findIndex(t => t.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ message: 'Todo not found' });
  todos.splice(index, 1);
  res.status(204).end();
});

// Mock user data for authentication
const users = [
  { id: 1, username: 'user1', password: 'password1' },
  { id: 2, username: 'user2', password: 'password2' }
];

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request:', username); // Debugging log
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    console.log('Invalid username or password'); // Debugging log
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: '1h' });
  res.json({ token });
});