const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: String,
  city: String,
  state: String,
  zip: String,
  driverLicense: String,
  plate: String
}, { timestamps: true });

module.exports = mongoose.model('Customer', customerSchema);
