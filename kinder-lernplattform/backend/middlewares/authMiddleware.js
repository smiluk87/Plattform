const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; // Secret aus Umgebungsvariablen laden 

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer-Token extrahieren
  console.log("Empfangener Token:", token); // Debugging

  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Ungültiger Token!' });
    }

    req.user = decoded; // Benutzerdaten speichern
    next();
  });
}

module.exports = verifyToken; // Hier wird die Funktion exportiert
