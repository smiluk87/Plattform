const express = require('express');
const router = express.Router();
const { generateToken } = require('../controllers/authController');
const verifyToken = require('../middlewares/authMiddleware');
const db = require('../models'); // Datenbankmodelle importieren
const userController = require('../controllers/userController'); // Benutzercontroller

// Benutzer-Routen
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);

// Route für die Registrierung
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  try {
    console.log("Eingehende Registrierungsdaten:", req.body);

    const user = await db.User.create({ username, email, password });
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!', user });
  } catch (error) {
    console.error("Fehler bei der Registrierung:", error);
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
    const userId = req.user.id;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.json({ username: user.username, email: user.email });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Profil aktualisieren
router.put('/profile', verifyToken, async (req, res) => {
  const { username, email } = req.body;

  try {
    const userId = req.user.id;
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    user.username = username;
    user.email = email;
    await user.save();

    res.json({ message: 'Profil erfolgreich aktualisiert', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Quizfragen
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

router.get('/quiz/:subject', verifyToken, (req, res) => {
  const subject = req.params.subject;
  const questions = quizData[subject];
  if (!questions) {
    return res.status(404).json({ message: "Thema nicht gefunden!" });
  }
  res.json(questions);
});

// Fortschritt speichern
router.post('/progress', verifyToken, async (req, res) => {
  try {
    const { category, score } = req.body;
    const userId = req.user.id;

    if (!category || score === undefined) {
      return res.status(400).json({ message: 'Kategorie und Punkte sind erforderlich!' });
    }

    console.log("Eingehende Fortschrittsdaten:", req.body);
    console.log("Benutzer-ID:", userId);

    const progressEntry = await db.Progress.create({
      userid: userId,
      category,
      score,
      timestamp: new Date(), // Aktueller Zeitstempel
    });

    res.status(201).json({ message: 'Fortschritt erfolgreich gespeichert!', progress: progressEntry });
  } catch (error) {
    console.error("Fehler beim Speichern des Fortschritts:", error);
    res.status(500).json({ message: 'Fehler beim Speichern des Fortschritts!', error: error.message });
  }
});

// Fortschritt abrufen
router.get('/progress', verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const progress = await db.Progress.findAll({
      where: { userid: userId },
    });

    const totalScores = progress.reduce((sum, entry) => sum + entry.score, 0);
    const averageScore = progress.length ? (totalScores / progress.length).toFixed(2) : 0;
    const highestScore = progress.reduce((max, entry) => (entry.score > max ? entry.score : max), 0);

    res.json({
      progress,
      statistics: {
        averageScore,
        highestScore,
        attempts: progress.length,
      },
    });
  } catch (error) {
    console.error("Fehler beim Abrufen des Fortschritts:", error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Fortschritts!', error: error.message });
  }
});

module.exports = router;
