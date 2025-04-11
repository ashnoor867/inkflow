const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const { ensureAuthenticated } = require('../middleware/auth');

// Get all blogs (public)
router.get('/', blogController.getAllBlogs);

// Get trending blogs (public)
router.get('/trending', blogController.getTrendingBlogs);

// Protected routes (require authentication)
router.get('/dashboard', ensureAuthenticated, blogController.getUserBlogs);
router.get('/create', ensureAuthenticated, blogController.showCreateForm);
router.post('/create', ensureAuthenticated, blogController.createBlog);
router.get('/edit/:id', ensureAuthenticated, blogController.showEditForm);
router.post('/edit/:id', ensureAuthenticated, blogController.updateBlog);
router.get('/delete/:id', ensureAuthenticated, blogController.deleteBlog);
router.post('/like/:id', ensureAuthenticated, blogController.toggleLikeBlog);

// Get single blog (public)
router.get('/:id', blogController.showBlog);

module.exports = router;