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

// Rangliste abrufen (mit Kategoriefilterung und Paginierung)
router.get('/leaderboard', async (req, res) => {
  const { page = 1, limit = 6, category } = req.query;
  const offset = (page - 1) * limit;

  try {
    const whereCondition = category ? { category } : {}; // Kategorie filtern, falls angegeben

    const results = await db.Progress.findAll({
      attributes: [
        'userid',
        [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore'],
      ],
      include: [
        {
          model: db.User,
          as: 'user',
          attributes: ['username'],
        },
      ],
      where: whereCondition,
      group: ['userid', 'user.id', 'user.username'],
      order: [[db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'DESC']],
    });

    const formattedResults = results.map((result, index) => ({
      rank: index + 1,
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

    const paginatedResults = formattedResults.slice(offset, offset + parseInt(limit));
    const totalPages = Math.ceil(formattedResults.length / limit);

    res.json({
      leaderboard: paginatedResults,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Fehler beim Abrufen der Rangliste:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Rangliste!' });
  }
});

// Profil abrufen
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await db.User.findByPk(req.user.id, {
      attributes: ['id', 'username', 'email'],
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

// Quizfragen abrufen
router.get('/quiz/:subject', verifyToken, (req, res) => {
  const subject = req.params.subject;

  const quizData = {
    math: [
      { question: 'Was ist 2 + 2?', options: ['3', '4', '5'], answer: '4' },
      { question: 'Was ist 10 - 5?', options: ['3', '4', '5'], answer: '5' },
      { question: 'Was ist die Wurzel aus 49?', options: ['6', '7', '8'], answer: '7' },
      { question: 'Was ist 8 * 5?', options: ['20', '24', '40'], answer: '40' },
      { question: 'Wie viele Ecken hat ein Würfel\?', options: ['6', '8', '12'], answer: '8' },
      { question: 'Was ist 88 / 11?', options: ['6', '8', '9'], answer: '8' },
      { question: 'Wie viele Sekunden sind in einer Stunde\?', options: ['360', '3600', '6000'], answer: '3600' },
      { question: 'Was ist 2³?', options: ['6', '8', '10'], answer: '8' },
      { question: 'Was ist der Flächeninhalt eines Rechtecks mit Länge 10m und Breite 5m?', options: ['40m²', '50m²', '60m²'], answer: '50m²' },
      { question: 'Was ist der Umfang eines Kreises mit Radius 7 (π ≈ 3,14)?', options: ['43,96', '44,00', '45,02'], answer: '43,96' },
    ],

    english: [
      { question: "What is the opposite of 'hot'?", options: ['cold', 'warm', 'cool'], answer: 'cold' },
      { question: "What is the opposite of 'happy'?", options: ['outraged', 'sad', 'overwhelmed'], answer: 'sad' },
      { question: "How many days are in a 'week'?", options: ['five', 'seven', 'ten'], answer: 'seven' },
      { question: "What is the plural of 'child'?", options: ['childs', 'children', 'childes'], answer: 'children' },
      { question: "Which sentence is correct?", options: ['She don\’t like pizza.', 'She doesn\’t like pizza.', 'She didn\’t likes pizza.'], answer: 'She doesn\’t like pizza.' },
      { question: "Which word is a noun?", options: ['run', 'apple', 'quickly'], answer: 'apple' },
      { question: "What is the correct spelling?", options: ['beleive', 'believe', 'belive'], answer: 'believe' },
      { question: "What is the past tense of 'go'?", options: ['goed', 'went', 'gone'], answer: 'went' },
      { question: "Which word is a synonym for 'beautiful'?", options: ['ugly', 'gorgeous', 'plain'], answer: 'gorgeous' },
      { question: "Which sentence expresses a planned future action?", options: ["I will visit my grandmother tomorrow.", "I visited my grandmother yesterday.", "I have visited my grandmother."], answer: "I will visit my grandmother tomorrow." },
    ],

  };

  const questions = quizData[subject];

  if (!questions) {
    return res.status(404).json({ message: 'Keine Fragen für dieses Thema gefunden!' });
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
  console.log("🚀 Fortschritts-Route wurde aufgerufen!");
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

// Benutzerstatistiken abrufen
router.get('/user/:id/statistics', async (req, res) => {
  const userId = req.params.id;

  try {
    const user = await db.User.findByPk(userId, {
      attributes: ['username'],
    });

    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    const progressData = await db.Progress.findAll({
      where: { userid: userId },
      attributes: [
        'category',
        [db.Sequelize.fn('SUM', db.Sequelize.col('score')), 'totalScore'],
        [db.Sequelize.fn('COUNT', db.Sequelize.col('category')), 'attempts'],
      ],
      group: ['category'],
    });

    const totalScores = progressData.reduce(
      (acc, item) => acc + parseInt(item.dataValues.totalScore),
      0
    );
    const averageScore = totalScores / (progressData.length || 1);

    const statistics = {
      username: user.username,
      totalScores,
      averageScore: averageScore.toFixed(2),
      categoryProgress: progressData.map((item) => ({
        category: item.dataValues.category,
        totalScore: item.dataValues.totalScore,
        attempts: item.dataValues.attempts,
      })),
    };

    res.json(statistics);
  } catch (error) {
    console.error('Fehler beim Abrufen der Statistiken:', error);
    res.status(500).json({ message: 'Fehler beim Abrufen der Statistiken!' });
  }
});

module.exports = router;
