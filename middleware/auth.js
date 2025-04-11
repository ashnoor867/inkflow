// Middleware for authentication checks and user management
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Store original URL to redirect after login
  req.session.returnTo = req.originalUrl;
  res.redirect('/auth/login');
}

// Middleware to add user information to response locals
function addUserToLocals(req, res, next) {
  res.locals.user = req.user || null;
  res.locals.isAuthenticated = req.isAuthenticated();
  next();
}

module.exports = {
  ensureAuthenticated,
  addUserToLocals
};