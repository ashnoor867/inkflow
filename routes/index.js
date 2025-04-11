const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { addUserToLocals } = require('../middleware/auth');

// Add user to all routes
router.use(addUserToLocals);

// Homepage route
router.get('/', async (req, res) => {
  try {
    // Get latest blogs for homepage
    const latestBlogs = await Blog.find()
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(6);
      
    res.render('home', {
      title: 'InkFlow - Welcome',
      latestBlogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to load homepage'
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('about', {
    title: 'About InkFlow'
  });
});

module.exports = router;