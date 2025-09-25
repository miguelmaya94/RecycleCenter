const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const router = express.Router();

// Helper: safely render signup with defaults
function renderSignup(res, { error = null, old = {} } = {}) {
  res.render('auth/signup', { error, old });
}

// GET /signup (render the page)
router.get('/signup', (req, res) => {
  renderSignup(res);
});

// POST /signup (handle form submit)
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Passwords must match
    if (password !== confirmPassword) {
      return renderSignup(res, {
        error: 'Passwords do not match.',
        old: { name, email, role }
      });
    }

    // Password length check
    if (!password || password.length < 8) {
      return renderSignup(res, {
        error: 'Password must be at least 8 characters.',
        old: { name, email, role }
      });
    }

    // Email already taken?
    const exists = await User.findOne({ email });
    if (exists) {
      return renderSignup(res, {
        error: 'An account with that email already exists.',
        old: { name, email, role }
      });
    }

    // Hash + save
    const hash = await bcrypt.hash(password, 12);

    await User.create({
      name,
      email,
      password: hash,
      role: role || 'USER'
    });

    // If you want auto-login:
    // req.session.userId = user._id;

    res.redirect('/login'); // or '/dashboard'
  } catch (err) {
    console.error('Signup error:', err);
    renderSignup(res, {
      error: 'Something went wrong. Please try again.',
      old: { name: req.body.name, email: req.body.email, role: req.body.role }
    });
  }
});

module.exports = router;
