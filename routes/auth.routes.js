// routes/auth.routes.js
const express = require('express');
const router = express.Router();
const auth = require('../controllers/auth.controller');

// Splash (GET) – show combined login/register page
router.get('/login', auth.splash);
router.get('/register', auth.splash);

// Login/Register (POST)
router.post('/login', auth.login);
router.post('/register', auth.register);

// Logout
router.get('/logout', auth.logout);

module.exports = router;
