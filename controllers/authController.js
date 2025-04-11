// Show login page and handle logout
const showLoginPage = (req, res) => {
  res.render('login', {
    title: 'Login Page'
  });
};

// Handle logout
const logout = (req, res, next) => {
  req.logout((error) => {
    if (error) { return next(error); }
    res.redirect('/');
  });
};

module.exports = {
  showLoginPage,
  logout
};