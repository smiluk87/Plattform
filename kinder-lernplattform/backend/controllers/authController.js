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

// Registrierung
const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Passwort hashen
    const hashedPassword = await bcrypt.hash(password, 10); // Passwort mit 10 Runden hashen

    // Benutzer erstellen
    const newUser = await db.User.create({
      username,
      email,
      password: hashedPassword, // Gehashtes Passwort speichern
    });

    res.status(201).json({
      message: 'Benutzer erfolgreich registriert!',
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Fehler bei der Registrierung:', error);
    res.status(500).json({ message: 'Fehler bei der Registrierung!' });
  }
};

// Login-Route
const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Benutzer anhand der E-Mail-Adresse suchen
    const user = await db.User.findOne({ where: { email } });

    // Benutzer nicht gefunden
    if (!user) {
      return res.status(401).json({ message: 'Benutzer nicht gefunden!' });
    }

    // Passwortprüfung
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Falsches Passwort!' });
    }

    // Token generieren
    const token = generateToken(user);

    // Erfolgreiche Antwort
    res.json({ 
      token, 
      message: 'Login erfolgreich!' 
    });
  } catch (error) {
    console.error('Fehler beim Login:', error);
    res.status(500).json({ message: 'Interner Serverfehler!' });
  }
};

module.exports = { register, login };
