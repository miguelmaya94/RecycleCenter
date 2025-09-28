const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

// Routers
const itemsRouter = require('./routes/items.routes');
const customersRouter = require('./routes/customers.routes');
const invoicesRouter = require('./routes/invoices.routes');
const adminRouter = require('./routes/admin.routes');
const authRouter = require('./routes/auth.routes'); // NEW

// Middleware
const { ensureAuth, ensureRole } = require('./middleware/auth');

const app = express();

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static + views
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Session
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// MongoDB connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Global locals (so layout has a title by default)
app.use((req, res, next) => {
  res.locals.title = 'Recycle Center';
  res.locals.user = req.session.user || null;
  next();
});

// 🔐 Auth routes
app.use('/', authRouter);

// Root redirect/splash
app.get('/', (req, res) => {
  if (!req.session.user) return res.redirect('/login'); // splash handler will render page
  // already logged in → redirect by role
  switch (req.session.user.role) {
    case 'business': return res.redirect('/dashboard/business');
    case 'user': return res.redirect('/dashboard/user');
    case 'sponsor': return res.redirect('/dashboard/sponsor');
    case 'superadmin': return res.redirect('/dashboard/admin');
    default: return res.redirect('/login');
  }
});

// 📊 Dashboards
app.get('/dashboard/business', ensureRole('business'), (req, res) => res.render('dashboards/business'));
app.get('/dashboard/user', ensureRole('user'), (req, res) => res.render('dashboards/user'));
app.get('/dashboard/sponsor', ensureRole('sponsor'), (req, res) => res.render('dashboards/sponsor'));
app.get('/dashboard/admin', ensureRole('superadmin'), (req, res) => res.render('dashboards/admin'));

// 📦 Business-only routes
app.use('/items', ensureRole('business'), itemsRouter);
app.use('/customers', ensureRole('business'), customersRouter);
app.use('/invoices', ensureRole('business'), invoicesRouter);

// 👑 Superadmin-only routes
app.use('/admin', ensureRole('superadmin'), adminRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
