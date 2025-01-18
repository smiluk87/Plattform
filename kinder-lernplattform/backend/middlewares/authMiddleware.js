const jwt = require('jsonwebtoken');
const db = require('../models'); // Import des Datenbankmodells
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  try {
    // Token validieren und Benutzerinformationen extrahieren
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Benutzer in der Datenbank überprüfen
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    next(); // Weiter zur nächsten Middleware
  } catch (error) {
    // Spezifische Fehlerbehandlung
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Ungültiges Token!' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token abgelaufen!' });
    }

    console.error('Fehler bei der Token-Überprüfung:', error);
    return res.status(500).json({ message: 'Ein Fehler ist aufgetreten!' });
  }
};

module.exports = { verifyToken };
