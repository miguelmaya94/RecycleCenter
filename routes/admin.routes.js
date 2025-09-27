const express = require('express');
const router = express.Router();
const c = require('../controllers/admin.controller');

router.get('/company', c.companyForm);
router.post('/company', c.companySave);
router.get('/employees', c.employees);

module.exports = router;
