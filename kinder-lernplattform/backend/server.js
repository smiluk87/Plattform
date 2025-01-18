require('dotenv').config(); // Umgebungsvariablen
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

// Routen importieren
const userRoutes = require('./routes/userRoutes'); // Benutzer-, Dashboard-, Fortschritt- und Quiz-Routen
const authRoutes = require('./routes/authRoutes'); // Authentifizierungs-Routen

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Beispiel-Route (Root-Endpoint)
app.get('/', (req, res) => {
  res.send('Willkommen auf der Lernplattform!');
});

// Routen registrieren
app.use('/api/users', userRoutes); // Alle Benutzer-, Fortschritts- und Quiz-Routen
app.use('/api/auth', authRoutes); // Authentifizierungs-Routen

// Fehlerbehandlung für nicht gefundene Routen
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route nicht gefunden!' });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
});
