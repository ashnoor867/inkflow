const Blog = require('../models/Blog');

/**
 * Get all blogs (with optional search)
 */
const getAllBlogs = async (req, res) => {
  try {
    let query = {};
    
    // Handle search query
    if (req.query.search) {
      query = { $text: { $search: req.query.search } };
    }
    
    // Handle tag filtering
    if (req.query.tag) {
      query.tags = req.query.tag;
    }
    
    const blogs = await Blog.find(query)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
      
    res.render('blogs/index', {
      title: 'All Blogs',
      blogs,
      search: req.query.search || '',
      tag: req.query.tag || ''
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to fetch blogs'
    });
  }
};

/**
 * Get user's blogs
 */
const getUserBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 });
      
    res.render('blogs/dashboard', {
      title: 'My Blogs',
      blogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to fetch your blogs'
    });
  }
};

/**
 * Show form to create new blog
 */
const showCreateForm = (req, res) => {
  res.render('blogs/create', {
    title: 'Create Blog'
  });
};

/**
 * Create new blog
 */
const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Parse tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    
    await Blog.create({
      title,
      content,
      tags: tagArray,
      author: req.user.id
    });
    
    res.redirect('/blogs/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('blogs/create', {
      title: 'Create Blog',
      error: 'Failed to create blog',
      blog: req.body
    });
  }
};

/**
 * Show single blog
 */
const showBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar');
      
    if (!blog) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found'
      });
    }
    
    res.render('blogs/show', {
      title: blog.title,
      blog,
      isOwner: req.user && blog.author.id === req.user.id
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch blog'
    });
  }
};

/**
 * Show edit form
 */
const showEditForm = async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      author: req.user.id
    });
    
    if (!blog) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found or you are not authorized'
      });
    }
    
    res.render('blogs/edit', {
      title: 'Edit Blog',
      blog
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch blog'
    });
  }
};

/**
 * Update blog
 */
const updateBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Parse tags
    const tagArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    
    const blog = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      {
        title,
        content,
        tags: tagArray,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!blog) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found or you are not authorized'
      });
    }
    
    res.redirect(`/blogs/${blog.id}`);
  } catch (error) {
    console.error(error);
    res.status(500).render('blogs/edit', {
      title: 'Edit Blog',
      error: 'Failed to update blog',
      blog: { ...req.body, _id: req.params.id }
    });
  }
};

/**
 * Delete blog
 */
const deleteBlog = async (req, res) => {
  try {
    const result = await Blog.deleteOne({
      _id: req.params.id,
      author: req.user.id
    });
    
    if (result.deletedCount === 0) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found or you are not authorized'
      });
    }
    
    res.redirect('/blogs/dashboard');
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to delete blog'
    });
  }
};

/**
 * Get trending blogs
 */
const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name avatar')
      .sort({ likes: -1, createdAt: -1 })
      .limit(10);
      
    res.render('blogs/trending', {
      title: 'Trending Blogs',
      blogs
    });
  } catch (error) {
    console.error(error);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch trending blogs'
    });
  }
};

module.exports = {
  getAllBlogs,
  getUserBlogs,
  showCreateForm,
  createBlog,
  showBlog,
  showEditForm,
  updateBlog,
  deleteBlog,
  getTrendingBlogs
};