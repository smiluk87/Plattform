const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// Simulierte Benutzer-Datenbank
const users = {
  "1": "Max",
  "2": "Anna",
  "3": "Tom"
};

// Simulierte Fortschrittsdaten (für mehrere Benutzer)
const userProgress = {
  "1": [
    { category: "math", score: 3, timestamp: new Date().toISOString() },
    { category: "english", score: 5, timestamp: new Date().toISOString() }
  ],
  "2": [
    { category: "math", score: 8, timestamp: new Date().toISOString() },
    { category: "english", score: 7, timestamp: new Date().toISOString() }
  ],
  "3": [
    { category: "math", score: 2, timestamp: new Date().toISOString() },
    { category: "english", score: 4, timestamp: new Date().toISOString() }
  ]
};

// Route für die Registrierung
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }
  res.status(201).json({ message: 'Benutzer erfolgreich registriert!' });
});

// Route für den Login
router.post('/login', (req, res) => {
  const user = { id: 1, username: 'testuser' }; // Beispiel-Benutzer
  const token = generateToken(user);
  res.json({ token });
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

// Ranglisten-Logik mit Kategorien-Filterung, Belohnungen und Paginierung
router.get('/leaderboard/:category?', verifyToken, (req, res) => {
  const category = req.params.category; // Optionaler Kategorie-Filter
  const { page = 1, limit = 10 } = req.query; // Standard: Seite 1, 10 Einträge pro Seite

  const allUsersProgress = Object.entries(userProgress);

  const leaderboard = allUsersProgress.map(([userId, progressEntries]) => {
    // Filter nach Kategorie, falls angegeben
    const filteredEntries = category
      ? progressEntries.filter(entry => entry.category === category)
      : progressEntries;

    const totalScore = filteredEntries.reduce((sum, entry) => sum + entry.score, 0);
    const username = users[userId]; // Benutzername aus der simulierten Datenbank
    return { userId, username, totalScore };
  });

  // Nur Benutzer mit Punkten anzeigen
  const validLeaderboard = leaderboard.filter(user => user.totalScore > 0);

  // Sortiere nach Gesamtpunkten absteigend
  validLeaderboard.sort((a, b) => b.totalScore - a.totalScore);

  // Füge Belohnungen hinzu
  validLeaderboard.forEach((user, index) => {
    if (index === 0) user.reward = 'Gold';
    else if (index === 1) user.reward = 'Silber';
    else if (index === 2) user.reward = 'Bronze';
  });

  // Paginierung anwenden
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + parseInt(limit);
  const paginatedLeaderboard = validLeaderboard.slice(startIndex, endIndex);

  res.json({
    leaderboard: paginatedLeaderboard,
    totalEntries: validLeaderboard.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(validLeaderboard.length / limit),
  });
});

// Geschützte Route: Benutzerprofil anzeigen
router.get('/profile', verifyToken, (req, res) => {
  const userId = req.user.id; // Angemeldeter Benutzer
  const username = users[userId] || `user${userId}`; // Simulierter Benutzername
  const email = `${username}@example.com`; // Simulierte E-Mail

  res.json({
    id: userId,
    username,
    email,
  });
});

// Geschützte Route: Benutzerprofil bearbeiten
router.put('/profile', verifyToken, (req, res) => {
  const { username, email } = req.body;

  // Validierung der Eingabefelder
  if (!username || !email) {
    return res.status(400).json({ message: 'Benutzername und E-Mail sind erforderlich!' });
  }

  // Simuliere das Aktualisieren des Profils
  res.json({
    message: 'Profil erfolgreich aktualisiert!',
    updatedUser: { username, email },
  });
});

module.exports = router;
