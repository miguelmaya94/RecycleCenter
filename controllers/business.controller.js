// controllers/business.controller.js
const Account = require('../models/Account');
const bcrypt = require('bcryptjs');

exports.registerForm = (req, res) => {
  res.render('auth/business-register', { title: 'Business Register', error: null });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Account.findOne({ email });
    if (exists) return res.render('auth/business-register', { error: 'Email already in use', title: 'Business Register' });

    const hash = await bcrypt.hash(password, 10);
    const account = await Account.create({ email, passwordHash: hash, role: 'business' });

    req.session.user = { 
      _id: account._id, 
      email: account.email, 
      role: account.role 
    };

    return res.redirect('/dashboard/business');
  } catch (err) {
    console.error('Business Register error:', err);
    res.status(500).send('Server error');
  }
};
