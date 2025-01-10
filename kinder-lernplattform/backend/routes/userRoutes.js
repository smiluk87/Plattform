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


module.exports = router;
