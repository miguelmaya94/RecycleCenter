const express = require('express');
const router = express.Router();
const c = require('../controllers/items.controller');

router.get('/', c.list);
router.get('/:id/edit', c.editForm);
router.post('/:id/save', c.save);
router.post('/:id/delete', c.remove);

module.exports = router;
