const mongoose = require('mongoose');

const lineSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item', required: true },
  grossLbs: { type: Number, default: 0 },
  rateLbs: { type: Number, default: 0 },
  netLbs: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  extPrice: { type: Number, default: 0 }
}, { _id: false });

const invoiceSchema = new mongoose.Schema({
  invoiceNo: { type: Number, index: true },
  employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee' },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
  lines: [lineSchema],
  totalNetLbs: { type: Number, default: 0 },
  totalAmount: { type: Number, default: 0 },
  invoiceDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
