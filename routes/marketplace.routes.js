const express = require('express');
const router = express.Router();
const marketplace = require('../controllers/marketplace.controller');
const { ensureRole } = require('../middleware/auth');

// Businesses: create & view listings
router.get('/', ensureRole('business'), marketplace.listAll);
router.get('/new', ensureRole('business'), marketplace.newForm);
router.post('/', ensureRole('business'), marketplace.create);

// View single listing + bids
router.get('/:id', ensureRole('business'), marketplace.view);

// Place a bid
router.post('/:id/bid', ensureRole('business'), marketplace.placeBid);

module.exports = router;
