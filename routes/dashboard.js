const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { ensureAuth } = require('../middleware/auth');

// GET /dashboard
router.get('/dashboard', ensureAuth, async (req, res) => {
  try {
    // Populate the business if the user has one
    const user = await User.findById(req.session.user._id).populate('business');

    if (!user) {
      return res.redirect('/login');
    }

    // Decide which dashboard to render based on role
    switch (user.role) {
      case 'business':
        return res.render('dashboards/business', { user });
      case 'user':
        return res.render('dashboards/user', { user });
      case 'sponsor':
        return res.render('dashboards/sponsor', { user });
      case 'superadmin':
        return res.render('dashboards/admin', { user });
      default:
        return res.redirect('/login');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading dashboard');
  }
});

module.exports = router;
