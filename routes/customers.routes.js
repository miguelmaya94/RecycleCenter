const express = require('express');
const router = express.Router();
const c = require('../controllers/customers.controller');

router.get('/', c.list);
router.get('/:id/edit', c.editForm);
router.post('/:id/save', c.save);

module.exports = router;
