const jwt = require('jsonwebtoken');
const { generateToken } = require('../controllers/authController'); // Import von generateToken
const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

function verifyToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Kein Token bereitgestellt!' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Benutzerinformationen speichern
    next();
  } catch (error) {
    res.status(401).json({ message: 'Ungültiges Token!' });
  }
}

module.exports = { verifyToken, generateToken };
