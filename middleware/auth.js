// middleware/auth.js
exports.ensureAuth = (req, res, next) => {
  if (req.session.user) return next();
  res.redirect('/login');
};

exports.ensureRole = (role) => {
  return (req, res, next) => {
    if (req.session.user && req.session.user.role === role) return next();
    return res.status(403).send('Forbidden');
  };
};
