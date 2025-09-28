// controllers/invoices.controller.js
const Invoice = require('../models/Invoice');
const Customer = require('../models/Customer');
const Item = require('../models/Item');

exports.list = async (req, res) => {
  const invoices = await Invoice.find().populate('customerId').populate('items');
  res.render('invoices/list', { invoices });
};

exports.newForm = async (req, res) => {
  const customers = await Customer.find();
  const items = await Item.find();
  res.render('invoices/new', { customers, items });
};

exports.create = async (req, res) => {
  await Invoice.create(req.body);
  res.redirect('/invoices');
};

exports.show = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id).populate('customerId').populate('items');
  if (!invoice) return res.status(404).send('Not found');
  res.render('invoices/show', { invoice });
};
