const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController'); // Login-Controller importieren

// Login-Route definieren
router.post('/login', login);

module.exports = router;
