const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const hbs = require('hbs');
const path = require('path');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogs');
const indexRoutes = require('./routes/index');

// Import handlebars helpers
const { registerHelpers } = require('./config/hbs-helpers');

// Initialize app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Configure passport
require('./config/passport');

// Set up hbs as the view engine with custom helpers
app.set('view options', { 
  layout: 'layouts/main' 
});
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../views'));

// Register partials directory
hbs.registerPartials(path.join(__dirname, '../views/partials'));

// Register custom helpers
registerHelpers(hbs);

// Routes
app.use('/', indexRoutes);
app.use('/auth', authRoutes);
app.use('/blogs', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Error',
    message: 'Something went wrong!' 
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});