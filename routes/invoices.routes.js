// routes/invoices.routes.js
const express = require('express');
const router = express.Router();
const invoices = require('../controllers/invoices.controller');

// Show all invoices
router.get('/', invoices.list);

// Show new invoice form
router.get('/new', invoices.newForm);

// Save invoice
router.post('/', invoices.create);

// (optional) Show single invoice
router.get('/:id', invoices.show);

module.exports = router;
