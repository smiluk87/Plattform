require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const jwt = require('jsonwebtoken');

app.use(express.json()); // Middleware für JSON
app.use('/users', userRoutes);

app.use(cors());
app.use(bodyParser.json());

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('Willkommen auf der Lernplattform!');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
