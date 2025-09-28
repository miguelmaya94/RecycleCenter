const Listing = require('../models/Listing');
const Bid = require('../models/Bid');
const Business = require('../models/Business');

exports.listAll = async (req, res) => {
  const listings = await Listing.find().populate('businessId');
  res.render('marketplace/list', { listings });
};

exports.newForm = (req, res) => {
  res.render('marketplace/new');
};

exports.create = async (req, res) => {
  try {
    const bizId = req.session.user.businessId;

    // ✅ Require a linked business profile
    if (!bizId) {
      return res
        .status(400)
        .send('Error: Your account is not linked to a registered business. Please complete business registration first.');
    }

    // Double-check that the business actually exists
    const business = await Business.findById(bizId);
    if (!business) {
      return res
        .status(400)
        .send('Error: Business profile not found. Please register your business first.');
    }

    await Listing.create({
      businessId: bizId,
      material: req.body.material,
      quantity: Number(req.body.quantity),
      unit: req.body.unit || 'kg',
      startingPrice: Number(req.body.startingPrice),
      description: req.body.description || ''
    });

    res.redirect('/marketplace');
  } catch (err) {
    console.error('Error creating listing:', err);
    res.status(500).send('Server Error: Could not create listing');
  }
};

exports.view = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('businessId');
  if (!listing) return res.status(404).send('Listing not found');

  const bids = await Bid.find({ listingId: listing._id }).populate('businessId');
  res.render('marketplace/view', { listing, bids });
};

exports.placeBid = async (req, res) => {
  try {
    if (!req.session.user.businessId) {
      return res.status(400).send('You need a registered business profile to bid.');
    }

    await Bid.create({
      listingId: req.params.id,
      businessId: req.session.user.businessId,
      amount: Number(req.body.amount)
    });

    res.redirect(`/marketplace/${req.params.id}`);
  } catch (err) {
    console.error('Error placing bid:', err);
    res.status(500).send('Server error');
  }
};
