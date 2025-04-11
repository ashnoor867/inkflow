const Blog = require('../models/Blog');

// Get all blogs with search and tag filtering
const getAllBlogs = async (req, res) => {
  try {
    let stuff = {};
    
    // Handle search query
    if (req.query.search) {
      stuff = { $text: { $search: req.query.search } };
    }
    
    // Handle tag filtering
    if (req.query.tag) {
      stuff.tags = req.query.tag;
    }
    
    const myBlogs = await Blog.find(stuff)
      .populate('author', 'name avatar')
      .sort({ createdAt: -1 });
      
    res.render('blogs/index', {
      title: 'All Blogs',
      blogs: myBlogs,
      search: req.query.search || '',
      tag: req.query.tag || ''
    });
  } catch (oops) {
    console.error(oops);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to fetch blogs'
    });
  }
};

// Get user's blogs
const getUserBlogs = async (req, res) => {
  try {
    const myStuff = await Blog.find({ author: req.user.id })
      .sort({ createdAt: -1 });
      
    res.render('blogs/dashboard', {
      title: 'My Blogs',
      blogs: myStuff
    });
  } catch (badThing) {
    console.error(badThing);
    res.status(500).render('error', { 
      title: 'Error',
      message: 'Failed to fetch your blogs'
    });
  }
};

// Show create blog form
const showCreateForm = (req, res) => {
  res.render('blogs/create', {
    title: 'Create Blog'
  });
};

// Create a new blog
const createBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Parse tags
    const tagStuff = tags ? tags.split(',').map(t => t.trim()) : [];
    
    await Blog.create({
      title,
      content,
      tags: tagStuff,
      author: req.user.id
    });
    
    res.redirect('/blogs/dashboard');
  } catch (ugh) {
    console.error(ugh);
    res.status(500).render('blogs/create', {
      title: 'Create Blog',
      error: 'Failed to create blog',
      blog: req.body
    });
  }
};

// Show a single blog
const showBlog = async (req, res) => {
  try {
    const theBlog = await Blog.findById(req.params.id)
      .populate('author', 'name avatar');
      
    if (!theBlog) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found'
      });
    }
    
    // Check if the current user has liked this blog
    const didILike = req.user ? theBlog.likedBy.includes(req.user.id) : false;
    
    res.render('blogs/show', {
      title: theBlog.title,
      blog: theBlog,
      isOwner: req.user && theBlog.author.id === req.user.id,
      isAuthenticated: !!req.user,
      hasLiked: didILike
    });
  } catch (problem) {
    console.error(problem);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch blog'
    });
  }
};

// Show edit blog form
const showEditForm = async (req, res) => {
  try {
    const myPost = await Blog.findOne({
      _id: req.params.id,
      author: req.user.id
    });
    
    if (!myPost) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found or you are not authorized'
      });
    }
    
    res.render('blogs/edit', {
      title: 'Edit Blog',
      blog: myPost
    });
  } catch (badError) {
    console.error(badError);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch blog'
    });
  }
};

// Update blog
const updateBlog = async (req, res) => {
  try {
    const { title, content, tags } = req.body;
    
    // Parse tags
    const tagList = tags ? tags.split(',').map(item => item.trim()) : [];
    
    const updatedOne = await Blog.findOneAndUpdate(
      { _id: req.params.id, author: req.user.id },
      {
        title,
        content,
        tags: tagList,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedOne) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found or you are not authorized'
      });
    }
    
    res.redirect(`/blogs/${updatedOne.id}`);
  } catch (wat) {
    console.error(wat);
    res.status(500).render('blogs/edit', {
      title: 'Edit Blog',
      error: 'Failed to update blog',
      blog: { ...req.body, _id: req.params.id }
    });
  }
};

// Delete blog
const deleteBlog = async (req, res) => {
  try {
    const doneStuff = await Blog.deleteOne({
      _id: req.params.id,
      author: req.user.id
    });
    
    if (doneStuff.deletedCount === 0) {
      return res.status(404).render('error', {
        title: 'Not Found',
        message: 'Blog not found or you are not authorized'
      });
    }
    
    res.redirect('/blogs/dashboard');
  } catch (oops) {
    console.error(oops);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to delete blog'
    });
  }
};

// Get trending blogs
const getTrendingBlogs = async (req, res) => {
  try {
    // Only find blogs that have at least one like
    const coolBlogs = await Blog.find({ likes: { $gt: 0 } })
      .populate('author', 'name avatar')
      .sort({ likes: -1, createdAt: -1 })
      .limit(10);
      
    res.render('blogs/trending', {
      title: 'Trending Blogs',
      blogs: coolBlogs
    });
  } catch (bigError) {
    console.error(bigError);
    res.status(500).render('error', {
      title: 'Error',
      message: 'Failed to fetch trending blogs'
    });
  }
};

// Toggle like status of a blog
const toggleLikeBlog = async (req, res) => {
  try {
    const postId = req.params.id;
    const personId = req.user.id;
    
    const targetBlog = await Blog.findById(postId);
    
    if (!targetBlog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }
    
    // Check if user has already liked the blog
    const userLikedIt = targetBlog.likedBy.includes(personId);
    
    let whatToDo;
    if (userLikedIt) {
      // Unlike: remove user from likedBy array and decrement likes count
      whatToDo = {
        $pull: { likedBy: personId },
        $inc: { likes: -1 }
      };
    } else {
      // Like: add user to likedBy array and increment likes count
      whatToDo = {
        $addToSet: { likedBy: personId },
        $inc: { likes: 1 }
      };
    }
    
    const afterUpdate = await Blog.findByIdAndUpdate(
      postId,
      whatToDo,
      { new: true }
    );
    
    res.json({
      success: true,
      likes: afterUpdate.likes,
      hasLiked: !userLikedIt
    });
  } catch (ugh) {
    console.error(ugh);
    res.status(500).json({
      success: false,
      message: 'Failed to update like status'
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
  getTrendingBlogs,
  toggleLikeBlog
};