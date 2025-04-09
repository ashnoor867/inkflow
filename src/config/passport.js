const passport = require('passport');
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../models/User');

// Configure GitHub strategy
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.GITHUB_CALLBACK_URL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let user = await User.findOne({ githubId: profile.id });
      
      if (user) {
        return done(null, user);
      }
      
      // If not, create a new user
      user = await User.create({
        githubId: profile.id,
        name: profile.displayName || profile.username,
        email: profile.emails && profile.emails[0] ? profile.emails[0].value : '',
        avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
      });
      
      return done(null, user);
    } catch (error) {
      return done(error, null);
    }
  }
));

// Serialize user to the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

module.exports = passport;