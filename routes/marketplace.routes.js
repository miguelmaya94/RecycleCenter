const express = require('express');
const router = express.Router();
const marketplace = require('../controllers/marketplace.controller');
const { ensureRole } = require('../middleware/auth');

router.get('/', ensureRole('business'), marketplace.listAll);
router.get('/new', ensureRole('business'), marketplace.newForm);
router.post('/', ensureRole('business'), marketplace.create);
router.get('/:id', ensureRole('business'), marketplace.view);
router.post('/:id/bid', ensureRole('business'), marketplace.placeBid);

module.exports = router;
