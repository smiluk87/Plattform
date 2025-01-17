const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const db = require('../models'); // Stelle sicher, dass die Datenbank eingebunden ist
const userController = require('../controllers/userController'); // Neuer Import für DB-basierte Benutzerverwaltung

// DB-basierte Benutzer-Routen
router.post('/users', userController.createUser); // Benutzer erstellen
router.get('/users', userController.getAllUsers); // Alle Benutzer abrufen

// Route für die Registrierung
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  // Eingabedaten validieren
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  try {
    console.log("Eingehende Registrierungsdaten:", req.body); // Debugging

    // Benutzer erstellen
    const user = await db.User.create({ username, email, password });
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!', user });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error); // Debugging
    res.status(500).json({ message: 'Fehler bei der Registrierung!', error: error.message });
  }
});

// Route für den Login
router.post('/login', (req, res) => {
  const user = { id: 1, username: 'testuser' };
  const token = generateToken(user);
  res.json({ token });
});

// Profil abrufen
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id; // ID aus dem Token
    const user = await db.User.findByPk(userId); // Suche den Benutzer in der DB

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.json({ username: user.username, email: user.email }); // Sende Benutzerdaten zurück
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profil aktualisieren
router.put('/profile', verifyToken, async (req, res) => {
  const { username, email } = req.body;

  try {
    const userId = req.user.id; // Benutzer-ID aus Token
    const user = await db.User.findByPk(userId); // Benutzer suchen

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    user.username = username;
    user.email = email;
    await user.save(); // Änderungen speichern

    res.json({ message: 'Profil erfolgreich aktualisiert', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Geschützte Route (Dashboard)
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Willkommen, ${req.user.username}!` });
});

// Quizfragen (Beispieldaten)
const quizData = {
  math: [
    { question: "Was ist 2 + 2?", options: ["3", "4", "5"], answer: "4" },
    { question: "Was ist 10 - 5?", options: ["3", "4", "5"], answer: "5" },
    { question: "Was ist 35 - 17?", options: ["19", "18", "22"], answer: "18" },
  ],
  english: [
    { question: "What is the opposite of 'hot'?", options: ["cold", "warm", "cool"], answer: "cold" },
    { question: "Which article fits: '___ apple'?", options: ["A", "An", "The"], answer: "An" },
  ],
};

// Endpunkt, um Quizfragen zu holen
router.get('/quiz/:subject', verifyToken, (req, res) => {
  const subject = req.params.subject;
  const questions = quizData[subject];
  if (!questions) {
    return res.status(404).json({ message: "Thema nicht gefunden!" });
  }
  res.json(questions);
});

// Fortschritt speichern
router.post('/progress', verifyToken, (req, res) => {
  const { category, score } = req.body;
  if (!category || score === undefined) {
    return res.status(400).json({ message: 'Kategorie und Punkte sind erforderlich!' });
  }
  const userId = req.user.id;
  if (!userProgress[userId]) {
    userProgress[userId] = [];
  }
  const progressEntry = { category, score, timestamp: new Date().toISOString() };
  userProgress[userId].push(progressEntry);
  res.status(201).json({ message: 'Fortschritt erfolgreich gespeichert!', progress: progressEntry });
});

// Fortschritt abrufen
router.get('/progress', verifyToken, (req, res) => {
  const userId = req.user.id;
  const progress = userProgress[userId] || [];
  const totalScores = progress.reduce((sum, entry) => sum + entry.score, 0);
  const averageScore = progress.length ? (totalScores / progress.length).toFixed(2) : 0;
  const highestScore = progress.reduce((max, entry) => (entry.score > max ? entry.score : max), 0);
  const attempts = progress.length;

  res.json({
    progress,
    statistics: {
      averageScore,
      highestScore,
      attempts,
    },
  });
});

module.exports = router;
