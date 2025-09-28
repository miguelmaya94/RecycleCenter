// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true, trim: true },
  passwordHash: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['business', 'user', 'sponsor', 'superadmin'], 
    required: true 
  },
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' }
}, { timestamps: true });

module.exports = mongoose.model('Account', accountSchema);
