const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const itemsRouter = require('./routes/items.routes');
const customersRouter = require('./routes/customers.routes');
const invoicesRouter = require('./routes/invoices.routes');
const adminRouter = require('./routes/admin.routes');

const app = express();

// Middleware
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


  
// Routes
app.get('/', (req, res) => res.render('main-menu'));
app.use('/items', itemsRouter);
app.use('/customers', customersRouter);
app.use('/invoices', invoicesRouter);
app.use('/admin', adminRouter);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
