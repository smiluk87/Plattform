const jwt = require('jsonwebtoken');
const db = require('../models'); // Import des Datenbankmodells
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

// Middleware zum Verifizieren des Tokens
const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Extrahiere den Token aus dem Header
  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  try {
    // Token validieren und decodieren
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Benutzerinformationen aus dem Token speichern

    // Überprüfen, ob der Benutzer in der Datenbank existiert
    const user = await db.User.findByPk(decoded.id); // Sucht den Benutzer anhand der ID im Token
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    // Weiter zur nächsten Middleware
    next();
  } catch (error) {
    // Fehlerbehandlung für ungültige oder abgelaufene Tokens
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Ungültiges Token!' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token abgelaufen!' });
    }

    // Allgemeiner Fehler
    console.error('Ein Fehler ist aufgetreten bei der Token-Überprüfung:', error);
    return res.status(500).json({ message: 'Ein Fehler ist aufgetreten!' });
  }
};

module.exports = { verifyToken };
