const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// Splash page
router.get('/', authController.splash);

// Auth routes
router.get('/login', authController.loginForm);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// User register
router.get('/register', authController.registerForm);
router.post('/register', authController.register);

// Business register
router.get('/business/register', authController.businessRegisterForm);
router.post('/business/register', authController.businessRegister);

// Sponsor register
router.get('/sponsor/register', authController.sponsorRegisterForm);
router.post('/sponsor/register', authController.sponsorRegister);

module.exports = router;
