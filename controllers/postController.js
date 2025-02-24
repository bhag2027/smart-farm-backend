// controllers/postController.js
const postModel = require('../models/post');  // Import the post model

// Function to create a post
const createPost = async (req, res) => {
  try {
    const { message } = req.body;
    const image = req.file ? req.file.filename : null;  // Handle image upload

    const newPost = new postModel({
      message,
      image
    });

    await newPost.save();

    res.status(201).json({
      status: "Success",
      message: "Post created successfully",
      post: newPost
    });
  } catch (error) {
    console.error("Error creating post:", error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while creating the post"
    });
  }
};

// Function to view posts
const viewPosts = async (req, res) => {
  try {
    const posts = await postModel.find();  // Get all posts from the database
    if (posts.length > 0) {
      res.status(200).json({
        status: "Success",
        posts: posts
      });
    } else {
      res.status(404).json({
        status: "No Posts Found"
      });
    }
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({
      status: "Error",
      message: "An error occurred while fetching posts"
    });
  }
};


// Function to delete a post
const deletePost = async (req, res) => {
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
  };

// Export the functions
module.exports = { createPost, viewPosts, deletePost };
