require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes'); // Benutzer-Routen importieren

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Benutzer-Routen registrieren
app.use('/users', userRoutes);

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('Willkommen auf der Lernplattform!');
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
