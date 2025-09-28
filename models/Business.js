// models/Business.js
const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  legalName: { type: String, required: true },
  dbaName: { type: String },
  address: { type: String, required: true },
  mailingAddress: { type: String },
  phone: { type: String, required: true },
  contactName: { type: String, required: true },
  licenseNumber: { type: String },
  sellersPermit: { type: String },
  calRecycleID: { type: String },
  epaID: { type: String },
  wasteHaulerPermit: { type: String },
  ein: { type: String },
  caftbID: { type: String },
  eddNumber: { type: String },
  bankInfo: { type: String },
  documents: {
    licenseFile: { type: String },
    recycleCertFile: { type: String },
    insuranceFile: { type: String }
  },
  complianceAcknowledged: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Business', businessSchema);
