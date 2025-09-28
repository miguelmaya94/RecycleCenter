// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const Account = require('../models/Account');
const Business = require('../models/Business'); // used in businessRegister

// -----------------------------
// Splash (home) — decides where to go if logged in
// -----------------------------
exports.splash = (req, res) => {
  if (req.session.user) {
    switch (req.session.user.role) {
      case 'business': return res.redirect('/dashboard/business');
      case 'user': return res.redirect('/dashboard/user');
      case 'sponsor': return res.redirect('/dashboard/sponsor');
      case 'superadmin': return res.redirect('/dashboard/admin');
    }
  }
  // We render splash which already contains a login form + register buttons
  res.render('auth/splash', { title: 'Welcome', error: null });
};

// -----------------------------
// Login
// -----------------------------
exports.loginForm = (req, res) => {
  // If you have a dedicated auth/login.ejs, change this to 'auth/login'
  // Using splash keeps things simple because it already has the login form.
  res.render('auth/splash', { title: 'Login', error: null });
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const account = await Account.findOne({ email });
    if (!account) {
      return res.render('auth/splash', { title: 'Login', error: 'Invalid email or password' });
    }

    const ok = await bcrypt.compare(password, account.passwordHash);
    if (!ok) {
      return res.render('auth/splash', { title: 'Login', error: 'Invalid email or password' });
    }

    req.session.user = {
      _id: account._id,
      email: account.email,
      role: account.role,
      businessId: account.businessId || null
    };

    switch (account.role) {
      case 'business': return res.redirect('/dashboard/business');
      case 'user': return res.redirect('/dashboard/user');
      case 'sponsor': return res.redirect('/dashboard/sponsor');
      case 'superadmin': return res.redirect('/dashboard/admin');
      default: return res.redirect('/login');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).send('Server error');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};

// -----------------------------
// User Registration (simple)
// -----------------------------
exports.registerForm = (req, res) => {
  res.render('auth/register', { title: 'User Registration', error: null });
};

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body; // user-only flow
    const exists = await Account.findOne({ email });
    if (exists) {
      return res.render('auth/register', { title: 'User Registration', error: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);
    const account = await Account.create({
      email,
      passwordHash: hash,
      role: 'user'
    });

    req.session.user = {
      _id: account._id,
      email: account.email,
      role: account.role,
      businessId: account.businessId || null
    };

    return res.redirect('/dashboard/user');
  } catch (err) {
    console.error('User register error:', err);
    res.status(500).send('Server error');
  }
};

// -----------------------------
// Business Registration (your code, integrated)
// -----------------------------
// Show the business registration form
exports.businessRegisterForm = (req, res) => {
  res.render('auth/business-register', { title: 'Business Registration' });
};

// Handle business registration
exports.businessRegister = async (req, res) => {
  try {
    const { email, password, legalName, contactName, phone, address } = req.body;

    const exists = await Account.findOne({ email });
    if (exists) {
      return res.render('auth/business-register', { 
        error: 'Email already in use', 
        title: 'Business Registration' 
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const account = await Account.create({ 
      email, 
      passwordHash: hash, 
      role: 'business' 
    });

    // Also create the Business profile with required fields
    const business = await Business.create({
      userId: account._id,
      legalName,
      contactName,
      phone,
      address
    });

    // Save businessId on the account for marketplace use
    account.businessId = business._id;
    await account.save();

    req.session.user = { 
      _id: account._id, 
      email: account.email, 
      role: account.role, 
      businessId: business._id 
    };

    res.redirect('/dashboard/business');
  } catch (err) {
    console.error('Business register error:', err);
    res.status(500).send('Server error');
  }
};

// -----------------------------
// Sponsor Registration (your code, integrated)
// -----------------------------
// Show the sponsor registration form
exports.sponsorRegisterForm = (req, res) => {
  res.render('auth/sponsor-register', { title: 'Sponsor Registration' });
};

// Handle sponsor registration
exports.sponsorRegister = async (req, res) => {
  try {
    const { email, password } = req.body;

    const exists = await Account.findOne({ email });
    if (exists) {
      return res.render('auth/sponsor-register', { 
        error: 'Email already in use', 
        title: 'Sponsor Registration' 
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const account = await Account.create({ 
      email, 
      passwordHash: hash, 
      role: 'sponsor' 
    });

    req.session.user = { 
      _id: account._id, 
      email: account.email, 
      role: account.role 
    };

    res.redirect('/dashboard/sponsor');
  } catch (err) {
    console.error('Sponsor register error:', err);
    res.status(500).send('Server error');
  }
};
