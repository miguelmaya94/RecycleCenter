const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  username: { type: String, unique: true },
  passwordHash: String,
  accessLevel: { type: String, enum: ['admin', 'employee'], default: 'employee' },
  email: String,
  homePhone: String,
  mobilePhone: String,
  city: String,
  state: String,
  zip: String
}, { timestamps: true });

module.exports = mongoose.model('Employee', employeeSchema);
