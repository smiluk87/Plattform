const jwt = require('jsonwebtoken');
const db = require('../models'); // Import des Datenbankmodells
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const verifyToken = async (req, res, next) => {
  console.log("🛠 Token-Prüfung gestartet...");
  const token = req.headers['authorization']?.split(' ')[1]; // Verwendung von optionalem Chaining

  if (!token) {
    console.log("⛔ Kein Token gefunden!");
    return res.status(401).json({ message: 'Zugriff verweigert. Kein Token vorhanden.' }); // Konsistente Fehlermeldung
  }

  try {
    // Token validieren und Benutzerinformationen extrahieren
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Benutzerinformationen aus dem Token speichern
    console.log("✅ Token gültig, User:", decoded);
    
    // Benutzer in der Datenbank überprüfen
    const user = await db.User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden.' }); // Konsistente Fehlermeldung
    }

    next(); // Weiter zur nächsten Middleware
  } catch (error) {
    // Fehlerhandling basierend auf dem Fehler des JWT
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Ungültiger Token.' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token abgelaufen.' });
    }

    console.error('Fehler bei der Token-Überprüfung:', error);
    return res.status(500).json({ message: 'Ein interner Fehler ist aufgetreten.' });
  }
};

module.exports = { verifyToken };
