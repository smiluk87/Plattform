const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET; //secret aus Umgebungsvariablen laden

// Funktion zum Generieren eines JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username }, // Payload
    JWT_SECRET, // Secret-Schlüssel
    { expiresIn: '1h' } // Ablaufzeit des Tokens
  );
}

module.exports = { generateToken };

