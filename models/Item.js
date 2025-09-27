const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  itemNo: Number,
  item: String,
  subItem: String,
  description: { type: String, required: true },
  crv: { type: Number, default: 0 },
  price: { type: Number, default: 0 },
  redeemRate: { type: Number, default: 0 },
  weight: { type: Number, default: 0 },
  scrap: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Item', itemSchema);
