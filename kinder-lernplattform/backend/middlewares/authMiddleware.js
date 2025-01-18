const jwt = require('jsonwebtoken');
const db = require('../models'); // Import des Datenbankmodells
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

const verifyToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  try {
    // Token decodieren
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;

    // Benutzer aus der Datenbank laden
    const user = await db.User.findByPk(decoded.id); // 'id' wird aus dem Token entnommen
    if (!user) {
      return res.status(404).json({ message: 'Benutzer nicht gefunden!' });
    }

    next(); // Wenn alles in Ordnung ist, weiter zur nächsten Middleware
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Ungültiges Token!' });
    } else if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token abgelaufen!' });
    }
    return res.status(500).json({ message: 'Ein Fehler ist aufgetreten!' });
  }
};

module.exports = { verifyToken };
