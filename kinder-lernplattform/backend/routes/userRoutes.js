const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // bcrypt für Passwort-Hashing und -Vergleich
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Benutzer erstellen
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10); // 10 ist der Salt-Wert

    // Benutzer erstellen
    const user = await db.User.create({ username, email, password: hashedPassword });
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
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10); // 10 ist der Salt-Wert

    // Benutzer erstellen
    const user = await db.User.create({ username, email, password: hashedPassword });
    res.status(201).json({ message: 'Benutzer erfolgreich registriert!', user });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
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
    // Benutzer anhand der E-Mail suchen
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    // Passwort vergleichen
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    // Token erstellen
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ token, message: 'Erfolgreich angemeldet!' });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ message: 'Fehler beim Login!', error: error.message });
  }
});

// Dashboard
router.get('/dashboard', verifyToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'], // Relevante Felder abrufen
    });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzerdaten!' });
  }
});

// Profil abrufen
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'], // Relevante Felder abrufen
    });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen des Profils:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen des Profils!' });
  }
});

// Profil aktualisieren (NEU hinzugefügt)
router.put('/profile', verifyToken, async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await db.User.findByPk(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    // Benutzer aktualisieren
    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.json({
      message: 'Profil erfolgreich aktualisiert!',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profils:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Profils!' });
  }
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
      { question: "What is the opposite of 'happy'?", options: ['outraged', 'sad', 'overwhelmed'], answer: 'sad' },
    ],
  };

  const questions = quizData[subject];

  if (!questions) {
    console.error(`Keine Fragen für das Thema "${subject}" gefunden.`);
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
