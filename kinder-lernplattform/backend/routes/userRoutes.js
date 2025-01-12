const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');

// Route für die Registrierung
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;
  //überprüfe, ob alle Felder ausgefüllt sind
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  // Simuliere eine erfolgreiche Registrierung
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

// Endpunkt, um Punkte zu speichern (optional)
router.post('/quiz/score', verifyToken, (req, res) => {
  const { score } = req.body;
  // Hier könntest du den Score in der Datenbank speichern
  res.json({ message: `Punkte gespeichert: ${score}` });
});

// Geschützte Route: Benutzerprofil anzeigen
router.get('/profile', verifyToken, (req, res) => {
  const user = {
    id: req.user.id,
    username: req.user.username,
    email: "testuser@example.com" // Beispiel-E-Mail, später dynamisch aus Datenbank
  };
  res.json(user);
});

// Geschützte Route: Benutzerprofil bearbeiten
router.put('/profile', verifyToken, (req, res) => {
  const { username, email } = req.body;

  // Validierung der Felder
  if (!username || !email) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  // Beispiel: Erfolgreiche Aktualisierung simulieren
  res.json({ message: 'Profil erfolgreich aktualisiert!', updatedUser: { username, email } });
});

// Fortschrittsdaten (Simulierte Datenbank)
const userProgress = {};

// Route zum Speichern des Fortschritts
router.post('/progress', verifyToken, (req, res) => {
  const { category, score } = req.body;

  if (!category || score === undefined) {
    return res.status(400).json({ message: 'Kategorie und Punkte sind erforderlich!' });
  }

  const userId = req.user.id;

  if (!userProgress[userId]) {
    userProgress[userId] = [];
  }

  const progressEntry = {
    category,
    score,
    timestamp: new Date().toISOString(),
  };

  userProgress[userId].push(progressEntry);

  // Meilenstein-Belohnungen
  let reward = null;
  if (score >= 10) {
    reward = 'Goldmedaille';
  } else if (score >= 5) {
    reward = 'Silbermedaille';
  } else if (score >= 3) {
    reward = 'Bronzemedaille';
  }

  res.status(201).json({
    message: 'Fortschritt erfolgreich gespeichert!',
    progress: progressEntry,
    reward, // Belohnung wird mit der Antwort zurückgegeben
  });
});

// Route zum Abrufen des Fortschritts
router.get('/progress', verifyToken, (req, res) => {
  const userId = req.user.id;
  const progress = userProgress[userId] || [];

  // Statistiken berechnen
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

// Ranglisten-Logik (Beispieldaten)
router.get('/leaderboard', verifyToken, (req, res) => {
  const allUsersProgress = Object.entries(userProgress);

  // Berechne die Gesamtpunkte jedes Benutzers
  const leaderboard = allUsersProgress.map(([userId, progressEntries]) => {
    const totalScore = progressEntries.reduce((sum, entry) => sum + entry.score, 0);
    return { userId, totalScore };
  });

  // Sortiere nach Gesamtpunkten absteigend
  leaderboard.sort((a, b) => b.totalScore - a.totalScore);

  // Beschränke die Anzeige auf die Top 10
  const top10 = leaderboard.slice(0, 10);

  res.json(top10);
});

module.exports = router;
