const CompanyInfo = require('../models/CompanyInfo');
const Employee = require('../models/Employee');

exports.companyForm = async (req, res) => {
  const doc = await CompanyInfo.findOne() || new CompanyInfo();
  res.render('admin/company', { doc });
};

exports.companySave = async (req, res) => {
  const existing = await CompanyInfo.findOne();
  if (existing) {
    await CompanyInfo.findByIdAndUpdate(existing._id, req.body);
  } else {
    await CompanyInfo.create(req.body);
  }
  res.redirect('/admin/company');
};

exports.employees = async (req, res) => {
  const emps = await Employee.find().sort({ lastName: 1 });
  res.render('admin/employees', { emps });
};
