const express = require('express');
const passport = require('passport');
const router = express.Router();
const authController = require('../controllers/authController');

// Load passport config
require('../config/passport');

// Login page
router.get('/login', authController.showLoginPage);

// GitHub auth routes
router.get('/github',
  passport.authenticate('github', { scope: ['user:email'] })
);

router.get('/github/callback',
  passport.authenticate('github', { failureRedirect: '/auth/login' }),
  (req, res) => {
    // Redirect to original URL if it exists or to dashboard
    const redirectUrl = req.session.returnTo || '/blogs/dashboard';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
  }
);

// Logout route
router.get('/logout', authController.logout);

module.exports = router;