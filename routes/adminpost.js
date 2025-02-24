// /routes/adminPostRoutes.js

const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { createPost, viewPosts } = require('../controllers/postController');
const upload = require('../middleware/upload');  // Import the upload middleware
const postModel = require('../models/post');  // Import the post model

// Middleware to check if the user is an admin
const verifyAdmin = (req, res, next) => {
  const token = req.headers.token;  // Get the token from headers
  if (!token) {
    return res.status(403).json({ status: "No token provided" });
  }

  // Verify the token and check if the user is an admin
  jwt.verify(token, 'farmapp', (error, decoded) => {
    if (error) {
      return res.status(401).json({ status: "Invalid token" });
    }
    
    // Check if the decoded user role is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ status: "Access denied. Admins only." });
    }
    
    // Proceed to the next middleware (post creation)
    next();
  });
};

// Route to create a daily rate post (accessible only to admins)
router.post('/create-daily-rate', verifyAdmin, upload.single('image'), async (req, res) => {
  const { message } = req.body;  // Get the message for the daily rate post

  try {
    const newPost = new postModel({
      message: message,  // Save the daily rate message
      image: req.file ? req.file.path : null,  // Save the image path if a file is uploaded
      postedDate: new Date(),  // Store the date when the post is created
    });

    // Save the post to the database
    await newPost.save();
    res.json({ status: "Success", message: "Post created successfully!" });  // Send a success response
  } catch (error) {
    res.status(500).json({ status: "Error", message: "Failed to save post" });
  }
});

// Route to fetch posts created by the admin
router.get('/view-admin-posts', verifyAdmin, async (req, res) => {
    try {
      const posts = await postModel.find().sort({ createdAt: -1 }); // Sort posts by creation date
      res.json({ success: true, posts });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Error fetching posts from server' });
    }
});


// Route to delete a post by ID
router.delete('/delete-post/:id', verifyAdmin, async (req, res) => {
    try {
      const postId = req.params.id; // Get the post ID from the request parameters
      const deletedPost = await postModel.findByIdAndDelete(postId); // Delete the post from the database
  
      if (!deletedPost) {
        return res.status(404).json({
          status: "Error",
          message: "Post not found",
        });
      }
  
      res.status(200).json({
        status: "Success",
        message: "Post deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({
        status: "Error",
        message: "An error occurred while deleting the post",
      });
    }
  });
module.exports = router;





