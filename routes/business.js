// routes/business.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Business = require('../models/Business');
const User = require('../models/User');
const { ensureAuth } = require('../middleware/auth');

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/business_docs/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// GET form
router.get('/signup', ensureAuth, (req, res) => {
  res.render('business-signup', { user: req.user });
});

// POST submit
router.post(
  '/signup',
  ensureAuth,
  upload.fields([
    { name: 'licenseFile', maxCount: 1 },
    { name: 'recycleCertFile', maxCount: 1 },
    { name: 'insuranceFile', maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const documents = {
        licenseFile: req.files['licenseFile']?.[0].path || null,
        recycleCertFile: req.files['recycleCertFile']?.[0].path || null,
        insuranceFile: req.files['insuranceFile']?.[0].path || null
      };

      const newBusiness = new Business({
        userId: req.user._id,
        legalName: req.body.legalName,
        dbaName: req.body.dbaName,
        address: req.body.address,
        mailingAddress: req.body.mailingAddress,
        phone: req.body.phone,
        contactName: req.body.contactName,
        licenseNumber: req.body.licenseNumber,
        sellersPermit: req.body.sellersPermit,
        calRecycleID: req.body.calRecycleID,
        epaID: req.body.epaID,
        wasteHaulerPermit: req.body.wasteHaulerPermit,
        ein: req.body.ein,
        caftbID: req.body.caftbID,
        eddNumber: req.body.eddNumber,
        bankInfo: req.body.bankInfo,
        documents,
        complianceAcknowledged: req.body.complianceAcknowledged ? true : false
      });

      const savedBusiness = await newBusiness.save();

      // Update User record
      await User.findByIdAndUpdate(req.user._id, {
        role: 'business',
        business: savedBusiness._id
      });

      res.redirect('/dashboard?signup=success');
    } catch (err) {
      console.error(err);
      res.status(500).send('Error saving business registration.');
    }
  }
);

module.exports = router;
