require('dotenv').config(); // Umgebungsvariablen
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Routen importieren
const userRoutes = require('./routes/userRoutes'); // Benutzer-Routen importieren
const authRoutes = require('./routes/authRoutes'); // Auth-Routen importieren

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Routen registrieren
app.use('/users', userRoutes); // Benutzer-Routen registrieren
app.use('/', authRoutes); // Authentifizierungs-Routen registrieren

// Beispiel-Route
app.get('/', (req, res) => {
  res.send('Willkommen auf der Lernplattform!');
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
