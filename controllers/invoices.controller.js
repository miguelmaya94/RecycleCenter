const Invoice = require('../models/Invoice');
const Item = require('../models/Item');
const Customer = require('../models/Customer');

function compute(line) {
  const netLbs = Math.max(0, Number(line.grossLbs || 0) - Number(line.rateLbs || 0));
  const price = Number(line.price || 0);
  const ext = +(netLbs * price).toFixed(2);
  return { netLbs, extPrice: ext };
}

exports.newForm = async (req, res) => {
  const items = await Item.find().sort({ description: 1 });
  const customers = await Customer.find().sort({ name: 1 });
  res.render('invoices/new', { items, customers });
};

exports.create = async (req, res) => {
  const { customerId, itemId = [], grossLbs = [], rateLbs = [], price = [] } = req.body;

  const lines = [];
  for (let i = 0; i < itemId.length; i++) {
    if (!itemId[i]) continue;
    const calc = compute({ grossLbs: grossLbs[i], rateLbs: rateLbs[i], price: price[i] });
    lines.push({
      item: itemId[i],
      grossLbs: Number(grossLbs[i] || 0),
      rateLbs: Number(rateLbs[i] || 0),
      netLbs: calc.netLbs,
      price: Number(price[i] || 0),
      extPrice: calc.extPrice
    });
  }

  const totals = {
    totalNetLbs: lines.reduce((s, l) => s + l.netLbs, 0),
    totalAmount: +lines.reduce((s, l) => s + l.extPrice, 0).toFixed(2)
  };

  const last = await Invoice.findOne().sort({ invoiceNo: -1 }).select('invoiceNo');
  const nextNo = (last?.invoiceNo || 0) + 1;

  const inv = await Invoice.create({
    invoiceNo: nextNo,
    customer: customerId || null,
    lines,
    ...totals
  });

  res.redirect(`/invoices/${inv._id}`);
};

exports.show = async (req, res) => {
  const invoice = await Invoice.findById(req.params.id)
    .populate('customer')
    .populate({ path: 'lines.item' });
  res.render('invoices/show', { invoice });
};
