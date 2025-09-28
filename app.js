const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const { ensureRole } = require('./middleware/auth');

// Routers
const itemsRouter = require('./routes/items.routes');
const customersRouter = require('./routes/customers.routes');
const invoicesRouter = require('./routes/invoices.routes');
const adminRouter = require('./routes/admin.routes');
const authRouter = require('./routes/auth.routes');
const marketplaceRouter = require('./routes/marketplace.routes');
const businessRouter = require('./routes/business.routes');

const app = express();

// Body + static + views
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/layout');

// Sessions (must come before routes)
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({ mongoUrl: process.env.MONGO_URI }),
  cookie: { maxAge: 1000 * 60 * 60 * 8 }
}));

// Make user + title available in all EJS templates
app.use((req, res, next) => {
  res.locals.title = 'Recycle Center';
  res.locals.user = req.session.user || null;
  next();
});

// DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.use('/', authRouter); // handles /, /login, /register
app.use('/business', businessRouter);
app.use('/items', ensureRole('business'), itemsRouter);
app.use('/customers', ensureRole('business'), customersRouter);
app.use('/invoices', ensureRole('business'), invoicesRouter);
app.use('/admin', ensureRole('superadmin'), adminRouter);
app.use('/marketplace', ensureRole('business'), marketplaceRouter);

// Dashboards
app.get('/dashboard/business', ensureRole('business'), (req, res) => res.render('dashboards/business'));
app.get('/dashboard/user', ensureRole('user'), (req, res) => res.render('dashboards/user'));
app.get('/dashboard/sponsor', ensureRole('sponsor'), (req, res) => res.render('dashboards/sponsor'));
app.get('/dashboard/admin', ensureRole('superadmin'), (req, res) => res.render('dashboards/admin'));

// Basic error handler so the app doesn’t die silently
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).send('Server error');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
