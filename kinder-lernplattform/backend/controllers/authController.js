const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // Für sichere Passwortüberprüfung
const db = require('../models'); // Annahme: Sequelize wird verwendet

// Umgebungsvariable oder Fallback-Schlüssel verwenden
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Funktion zum Generieren eines JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username }, // Payload
    JWT_SECRET, // Secret-Schlüssel
    { expiresIn: '1h' } // Ablaufzeit des Tokens
  );
}

// Login-Route
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Benutzer anhand der E-Mail-Adresse suchen
    const user = await db.User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    // Passwort prüfen (bcrypt verwenden)
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Ungültige Zugangsdaten!' });
    }

    // Token generieren
    const token = generateToken(user);
    res.json({ token, message: 'Erfolgreich angemeldet!' });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ message: 'Fehler beim Login!' });
  }
};

module.exports = { login };
