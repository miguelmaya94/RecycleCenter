const express = require('express');
const router = express.Router();
const c = require('../controllers/invoices.controller');

router.get('/new', c.newForm);
router.post('/', c.create);
router.get('/:id', c.show);

module.exports = router;
