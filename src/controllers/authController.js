/**
 * Display the login page
 */
const showLoginPage = (req, res) => {
  res.render('login', {
    title: 'Login'
  });
};

/**
 * Handle logout
 */
const logout = (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/');
  });
};

module.exports = {
  showLoginPage,
  logout
};