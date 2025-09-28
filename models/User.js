// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'business', 'admin'], default: 'customer' },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'Business' } // <-- add this
});

module.exports = mongoose.model('User', userSchema);
