const mongoose = require('mongoose');

const companyInfoSchema = new mongoose.Schema({
  companyName: String,
  recyclingNumber: String,
  address: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  fax: String
}, { timestamps: true });

module.exports = mongoose.model('CompanyInfo', companyInfoSchema);
