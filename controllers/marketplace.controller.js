const Listing = require('../models/Listing');
const Bid = require('../models/Bid');

// Show all listings
exports.listAll = async (req, res) => {
  const listings = await Listing.find().populate('businessId');
  res.render('marketplace/list', { listings });
};

// New listing form
exports.newForm = (req, res) => {
  res.render('marketplace/new');
};

// Create listing
exports.create = async (req, res) => {
  await Listing.create({
    businessId: req.session.user.businessId,
    material: req.body.material,
    quantity: req.body.quantity,
    unit: req.body.unit,
    startingPrice: req.body.startingPrice,
    description: req.body.description
  });
  res.redirect('/marketplace');
};

// View listing + bids
exports.view = async (req, res) => {
  const listing = await Listing.findById(req.params.id).populate('businessId');
  const bids = await Bid.find({ listingId: listing._id }).populate('businessId');
  res.render('marketplace/view', { listing, bids });
};

// Place a bid
exports.placeBid = async (req, res) => {
  await Bid.create({
    listingId: req.params.id,
    businessId: req.session.user.businessId,
    amount: req.body.amount
  });
  res.redirect(`/marketplace/${req.params.id}`);
};
