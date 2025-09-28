// controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const Account = require('../models/Account');

exports.splash = (req, res) => {
  if (req.session.user) {
    // already logged in → redirect by role
    switch (req.session.user.role) {
      case 'business': return res.redirect('/dashboard/business');
      case 'user': return res.redirect('/dashboard/user');
      case 'sponsor': return res.redirect('/dashboard/sponsor');
      case 'superadmin': return res.redirect('/dashboard/admin');
    }
  }
  res.render('auth/splash', { title: 'Welcome' });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const account = await Account.findOne({ email });
  if (!account) return res.render('auth/splash', { error: 'Invalid email or password', title: 'Welcome' });

  const ok = await bcrypt.compare(password, account.passwordHash);
  if (!ok) return res.render('auth/splash', { error: 'Invalid email or password', title: 'Welcome' });

  req.session.user = { _id: account._id, email: account.email, role: account.role, businessId: account.businessId };

  switch (account.role) {
    case 'business': return res.redirect('/dashboard/business');
    case 'user': return res.redirect('/dashboard/user');
    case 'sponsor': return res.redirect('/dashboard/sponsor');
    case 'superadmin': return res.redirect('/dashboard/admin');
    default: return res.redirect('/login');
  }
};

exports.register = async (req, res) => {
  const { email, password, role } = req.body;
  const exists = await Account.findOne({ email });
  if (exists) return res.render('auth/splash', { error: 'Email already in use', title: 'Welcome' });

  const hash = await bcrypt.hash(password, 10);
  const account = await Account.create({ email, passwordHash: hash, role });

  req.session.user = { _id: account._id, email: account.email, role: account.role, businessId: account.businessId };

  switch (account.role) {
    case 'business': return res.redirect('/dashboard/business');
    case 'user': return res.redirect('/dashboard/user');
    case 'sponsor': return res.redirect('/dashboard/sponsor');
    case 'superadmin': return res.redirect('/dashboard/admin');
    default: return res.redirect('/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy(() => res.redirect('/login'));
};
