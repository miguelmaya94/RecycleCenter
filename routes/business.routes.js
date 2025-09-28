const express = require('express');
const router = express.Router();
const businessController = require('../controllers/business.controller');

router.get('/register', businessController.registerForm);
router.post('/register', businessController.register);

module.exports = router;
