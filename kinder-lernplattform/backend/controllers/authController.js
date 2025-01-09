const jwt = require('jsonwebtoken');

// Secret aus Umgebungsvariablen laden
const JWT_SECRET = process.env.JWT_SECRET;

// Funktion zum Generieren eines JWT
function generateToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username }, // Payload
    JWT_SECRET, // Secret-Schlüssel
    { expiresIn: '1h' } // Ablaufzeit des Tokens
  );
}

// Beispiel-Route, die einen Token zurückgibt
app.post('/login', (req, res) => {
  const user = { id: 1, username: 'testuser' }; // Beispiel-Benutzer
  const token = generateToken(user);

  res.json({ token });
});

module.exports = { generateToken };
