const express = require('express');
const PostModel = require('../models/post');
const { authenticateAdmin } = require('../middleware/authenticateAdmin');

const router = express.Router();

// Route to get all posts for the admin
router.get('/posts', authenticateAdmin, async (req, res) => {
    try {
        const posts = await PostModel.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching posts', error });
    }
});

// Additional routes (create, update, delete) can go here

module.exports = router;
