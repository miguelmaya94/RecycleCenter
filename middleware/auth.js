// middleware/auth.js

// Require login
function ensureAuth(req, res, next) {
  if (req.session && req.session.user) return next();
  return res.redirect('/login');
}

// Require specific role(s)
// usage: ensureRole('business') or ensureRole(['business', 'admin'])
function ensureRole(required) {
  const allowed = Array.isArray(required) ? required : [required];

  return (req, res, next) => {
    const user = req.session && req.session.user;
    if (!user) return res.redirect('/login');

    if (allowed.includes(user.role)) return next();

    // Optional: use a 403 template if you have one (errors/403.ejs)
    return res.status(403).send('Forbidden: insufficient role');
  };
}

module.exports = { ensureAuth, ensureRole };
