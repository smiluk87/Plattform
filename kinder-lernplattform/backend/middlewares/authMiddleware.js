const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Token entschlüsseln
    req.user = decoded; // Benutzerinformationen speichern
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Ungültiges Token!' });
  }
}

module.exports = verifyToken;
