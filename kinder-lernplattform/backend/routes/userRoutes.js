const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken'); // Für Token-Generierung
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../models');

// Benutzer erstellen
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await db.User.create({ username, email, password });
    res.status(201).json({ message: 'Benutzer erfolgreich erstellt!', user });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Erstellen des Benutzers!', error: error.message });
  }
});

// Alle Benutzer abrufen
router.get('/users', async (req, res) => {
  try {
    const users = await db.User.findAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzer!', error: error.message });
  }
});

// Registrierung
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Alle Felder sind erforderlich!' });
  }

  try {
    const user = await db.User.create({ username, email, password });
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!', user });
  } catch (error) {
    res.status(500).json({ message: 'Fehler bei der Registrierung!', error: error.message });
  }
});

// Login
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, 'geheimesToken', { expiresIn: '1h' });
    res.json({ token, message: 'Erfolgreich angemeldet!' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login!', error: error.message });
  }
});


// Profil abrufen
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id);

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
    const user = await db.User.findByPk(req.user.id);

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

// Dashboard
router.get('/dashboard', verifyToken, (req, res) => {
  res.json({ message: `Willkommen auf dem Dashboard, ${req.user.username}!` });
});

// Quizfragen abrufen
router.get('/quiz/:subject', verifyToken, (req, res) => {
  const subject = req.params.subject;
  const quizData = {
    math: [
      { question: 'Was ist 2 + 2?', options: ['3', '4', '5'], answer: '4' },
      { question: 'Was ist 10 - 5?', options: ['3', '4', '5'], answer: '5' },
    ],
    english: [
      { question: "What is the opposite of 'hot'?", options: ['cold', 'warm', 'cool'], answer: 'cold' },
    ],
  };
  const questions = quizData[subject];
  if (!questions) {
    return res.status(404).json({ message: 'Thema nicht gefunden!' });
  }
  res.json(questions);
});

// Fortschritt speichern
router.post('/progress', verifyToken, async (req, res) => {
  const { category, score } = req.body;
  if (!category || score === undefined) {
    return res.status(400).json({ message: 'Kategorie und Score sind erforderlich!' });
  }

  try {
    const progress = await db.Progress.create({
      userid: req.user.id,
      category,
      score,
      timestamp: new Date(),
    });

    res.status(201).json({ message: 'Fortschritt erfolgreich gespeichert!', progress });
  } catch (error) {
    console.error("Fehler beim Speichern des Fortschritts:", error);
    res.status(500).json({ message: 'Fehler beim Speichern des Fortschritts!', error: error.message });
  }
});

// Fortschritt abrufen
router.get('/progress', verifyToken, async (req, res) => {
  try {
    const progresses = await db.Progress.findAll({ where: { userid: req.user.id } });

    const totalScores = progresses.reduce((sum, entry) => sum + entry.score, 0);
    const statistics = {
      averageScore: progresses.length ? (totalScores / progresses.length).toFixed(2) : 0,
      highestScore: progresses.length ? Math.max(...progresses.map((p) => p.score)) : 0,
      attempts: progresses.length,
    };

    res.json({ progresses, statistics });
  } catch (error) {
    console.error('Fehler beim Abrufen des Fortschritts:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Fortschritts!' });
  }
});

// Rangliste abrufen
router.get('/leaderboard', verifyToken, async (req, res) => {
  try {
    const results = await db.Progress.findAll({
      attributes: [
        'userid',
        [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore']
      ],
      include: [
        {
          model: db.User,
          attributes: ['username']
        }
      ],
      group: ['userid', 'User.id', 'User.username'],
      order: [[db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'DESC']]
    });

    const formattedResults = results.map((result) => ({
      userId: result.userid,
      username: result.User.username,
      totalScore: result.dataValues.totalScore,
    }));

    res.json({ leaderboard: formattedResults });
  } catch (error) {
    console.error('Fehler beim Abrufen der Rangliste:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Rangliste!' });
  }
});

module.exports = router;
