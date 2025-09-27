const Customer = require('../models/Customer');

exports.list = async (req, res) => {
  const q = req.query.q?.trim();
  const filter = q ? { name: new RegExp(q, 'i') } : {};
  const customers = await Customer.find(filter).sort({ name: 1 }).limit(100);
  res.render('customers/index', { customers, q: q || '' });
};

exports.editForm = async (req, res) => {
  const customer = req.params.id === 'new' ? new Customer() : await Customer.findById(req.params.id);
  res.render('customers/edit', { customer });
};

exports.save = async (req, res) => {
  if (req.params.id === 'new') {
    await Customer.create(req.body);
  } else {
    await Customer.findByIdAndUpdate(req.params.id, req.body);
  }
  res.redirect('/customers');
};
