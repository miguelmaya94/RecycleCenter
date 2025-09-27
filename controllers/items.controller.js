const Item = require('../models/Item');

exports.list = async (req, res) => {
  const items = await Item.find().sort({ itemNo: 1 });
  res.render('items/index', { items });
};

exports.editForm = async (req, res) => {
  const item = req.params.id === 'new' ? new Item() : await Item.findById(req.params.id);
  res.render('items/edit', { item });
};

exports.save = async (req, res) => {
  if (req.params.id === 'new') {
    await Item.create(req.body);
  } else {
    await Item.findByIdAndUpdate(req.params.id, req.body);
  }
  res.redirect('/items');
};

exports.remove = async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.redirect('/items');
};
