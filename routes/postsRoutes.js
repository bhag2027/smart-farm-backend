// // // routes/postsRoutes.js
// // const express = require('express');
// // const router = express.Router();
// // const postController = require('../controllers/postController');  // Import the post controller
// // const authenticateAdmin = require('../middleware/authMiddleware');  // Import middleware

// // // Route to view posts (GET) with authentication middleware
// // router.get('/admin/posts/view-daily-rates', authenticateAdmin, postController.viewPosts);

// // // Route to create a post (POST) with authentication middleware
// // router.post('/admin/posts/create-daily-rate', authenticateAdmin, postController.createPost);

// // module.exports = router;  // Export the router to use in the app
// // In your backend routes file (e.g., postRoutes.js)
// // routes/postRoutes.js

// const express = require('express');
// const PostModel = require('../models/post'); // Ensure the path is correct
// const { authenticateAdmin } = require('../middleware/authenticateAdmin'); // Use destructuring to get the middleware

// const router = express.Router();
// const JWT_SECRET = 'your_jwt_secret_key_here'; 
// // Route to get all posts for the admin
// router.get('/posts', authenticateAdmin, async (req, res) => {
//     try {
//         const posts = await PostModel.find().sort({ createdAt: -1 });
//         res.status(200).json(posts);
//     } catch (error) {
//         res.status(500).json({ message: 'Error fetching posts', error });
//     }
// });

// module.exports = router;
