const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// sponsor register
router.get('/sponsor/register', authController.sponsorRegisterForm);
router.post('/sponsor/register', authController.sponsorRegister);

module.exports = router;
