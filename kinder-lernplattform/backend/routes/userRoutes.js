const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

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
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-Mail und Passwort sind erforderlich!' });
  }

  try {
    const user = await db.User.findOne({ where: { email } });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Erfolgreich angemeldet!' });
  } catch (error) {
    res.status(500).json({ message: 'Fehler beim Login!', error: error.message });
  }
});

// Dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.json({
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Dashboards:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Dashboards!' });
  }
});

// Quizfragen abrufen
router.get('/quiz/:subject', verifyToken, (req, res) => {
  const subject = req.params.subject;

  console.log('Quiz-Anfrage empfangen für Fach:', subject); // Debugging-Log
  const quizData = {
    math: [
      { question: 'Was ist 2 + 2?', options: ['3', '4', '5'], answer: '4' },
      { question: 'Was ist 10 - 5?', options: ['3', '4', '5'], answer: '5' },
    ],
    english: [
      { question: "What is the opposite of 'hot'?", options: ['cold', 'warm', 'cool'], answer: 'cold' },
      { question: "What is the opposite of 'happy'?", options: ['outraged', 'sad', 'overwhelmed'], answer: 'sad' },
    ],
  };

  const questions = quizData[subject];
  if (!questions) {
    console.error('Keine Fragen für das Thema gefunden:', subject); // Debugging-Log
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
    console.error('Fehler beim Speichern des Fortschritts:', error);
    res.status(500).json({ message: 'Fehler beim Speichern des Fortschritts!', error: error.message });
  }
});

// Fortschritt abrufen
router.get('/progress', verifyToken, async (req, res) => {
  try {
    const progress = await db.Progress.findAll({ where: { userid: req.user.id } });

    if (!progress || progress.length === 0) {
      return res.status(404).json({ message: 'Keine Fortschrittsdaten gefunden!' });
    }

    res.json(progress);
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
        [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore'],
      ],
      include: [
        {
          model: db.User,
          attributes: ['username'],
        },
      ],
      group: ['userid', 'User.id', 'User.username'],
      order: [[db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'DESC']],
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
