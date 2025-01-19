const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { verifyToken } = require('../middlewares/authMiddleware');
const db = require('../models');

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Benutzer erstellen
router.post('/users', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const hashedPassword = await bcrypt.hash(password, 10);
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
    const user = await db.User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

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
      attributes: ['id', 'username', 'email'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    res.json({ id: user.id, username: user.username, email: user.email });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerdaten:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzerdaten!' });
  }
});

// Benutzerstatistiken abrufen
router.get('/:userId/statistics', verifyToken, async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await db.User.findByPk(userId, {
      attributes: ['username'],
      include: [
        {
          model: db.Progress,
          as: 'progresses',
          attributes: ['category', 'score'],
        },
      ],
    });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    const categoryProgress = user.progresses.reduce((acc, progress) => {
      acc[progress.category] = (acc[progress.category] || 0) + progress.score;
      return acc;
    }, {});

    const totalScores = Object.values(categoryProgress).reduce((sum, val) => sum + val, 0);
    const attempts = user.progresses.length;
    const averageScore = attempts > 0 ? (totalScores / attempts).toFixed(2) : 0;

    res.json({
      username: user.username,
      totalScores,
      averageScore,
      categoryProgress,
      attempts,
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Benutzerstatistiken:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Benutzerstatistiken!' });
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

    user.username = username || user.username;
    user.email = email || user.email;
    await user.save();

    res.json({
      message: 'Profil erfolgreich aktualisiert!',
      user: { id: user.id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Profils:', error);
    res.status(500).json({ message: 'Fehler beim Aktualisieren des Profils!' });
  }
});

// Rangliste abrufen (mit Kategoriefilterung und Paginierung)
router.get('/leaderboard', verifyToken, async (req, res) => {
  const { category = '', page = 1, limit = 6 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const whereClause = category ? { category } : {};
    const results = await db.Progress.findAll({
      attributes: [
        'userid',
        [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore'],
      ],
      where: whereClause,
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['username'],
        },
      ],
      group: ['userid', 'user.id', 'user.username'],
      order: [[db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'DESC']],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    const formattedResults = results.map((result, index) => ({
      rank: offset + index + 1,
      username: result.user.username,
      totalScore: result.dataValues.totalScore,
      badge:
        index === 0
          ? 'Gold'
          : index === 1
          ? 'Silber'
          : index === 2
          ? 'Bronze'
          : 'Teilnahme',
    }));

    res.json({ leaderboard: formattedResults });
  } catch (error) {
    console.error('Fehler beim Abrufen der Rangliste:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Rangliste!' });
  }
});

module.exports = router;
