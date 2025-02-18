require('dotenv').config(); // Umgebungsvariablen laden
const express = require('express');
const cors = require('cors');
const app = express();

// Routen importieren
const userRoutes = require('./routes/userRoutes'); // Benutzer-, Dashboard-, Fortschritt- und Quiz-Routen
const authRoutes = require('./routes/authRoutes'); // Authentifizierungs-Routen

// Middleware
app.use(cors());
app.use(express.json()); // Express integriert bodyParser.json()

// Beispiel-Route (Root-Endpoint)
app.get('/', (req, res) => {
  res.send('Willkommen auf der Lernplattform!');
});

// Authentifizierungsrouten registrieren (Login, Registrierung usw.)
app.use('/api', userRoutes); // Alle Routen sind unter '/api/*' erreichbar
app.use('/auth', authRoutes); // Alle Routen sind unter '/auth/*' erreichbar, z. B. '/auth/login'

// Benutzer-, Fortschritts- und Quizrouten registrieren
//app.use('/users', userRoutes); // Alle Routen sind jetzt unter '/users/*' erreichbar

// Fehlerbehandlung für nicht gefundene Routen
app.use((req, res, next) => {
  res.status(404).json({ message: 'Route nicht gefunden!' });
});

// Allgemeine Fehlerbehandlung
app.use((err, req, res, next) => {
  console.error('Allgemeiner Fehler:', err);
  res.status(500).json({ message: 'Ein interner Serverfehler ist aufgetreten!', error: err.message });
});

// Server starten
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server läuft auf Port ${PORT}`);
  console.log('Verfügbare Endpunkte:');
  console.log(`  - GET    /            (Willkommensnachricht)`);
  console.log(`  - POST   /auth/login  (Login-Route)`);
  console.log(`  - Weitere Auth-Routen sind unter /auth verfügbar`);
  console.log(`  - Benutzer- und Quiz-Routen sind unter /users verfügbar`);
});
