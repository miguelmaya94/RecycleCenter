const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  businessId: { type: mongoose.Schema.Types.ObjectId, ref: 'Business', required: true },
  material: { type: String, required: true },   // e.g. Aluminum, Cardboard
  quantity: { type: Number, required: true },   // e.g. 1000
  unit: { type: String, default: 'kg' },        // e.g. kg, lbs, tons
  startingPrice: { type: Number, required: true },
  description: { type: String },
  status: { type: String, enum: ['open', 'closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Listing', listingSchema);
