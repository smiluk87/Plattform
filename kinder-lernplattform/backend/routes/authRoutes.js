const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// Login-Route definieren 
router.post('/login', login);

module.exports = router;
