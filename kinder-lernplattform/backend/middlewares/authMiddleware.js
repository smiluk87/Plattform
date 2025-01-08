const jwt = require('jsonwebtoken');

// Secret aus Umgebungsvariablen laden
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware zum Verifizieren eines JWT
function verifyToken(req, res, next) {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Ungültiger Token!' });
    }

    req.user = decoded; // Dekodierte Benutzerdaten speichern
    next();
  });
}

module.exports = verifyToken;
