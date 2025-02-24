// /routes/userPostRoutes.js

const express = require('express');
const router = express.Router();
const postModel = require('../models/post');  // Import the post model

// Route to fetch posts for users
router.get('/view', async (req, res) => {
  try {
    const posts = await postModel.find().sort({ createdAt: -1 }); 
    res.json({ success: true, posts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching posts from server' });
  }
});

module.exports = router; // Export the router
