const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Zugriff verweigert! Kein Token bereitgestellt.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verifiziere den Token
    req.user = decoded; // Füge die Benutzerinformationen zur Anfrage hinzu
    next(); // Weiter zur nächsten Middleware oder Route
  } catch (error) {
    return res.status(403).json({ message: 'Ungültiger oder abgelaufener Token!' });
  }
};

module.exports = verifyToken;
