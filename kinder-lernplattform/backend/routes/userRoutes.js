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

module.exports = router;
