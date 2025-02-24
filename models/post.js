const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    message: {
        type: String,
        required: true,
    },
    image: {
        type: String, // Store the image URL
        required: true,
    },
}, { timestamps: true }); // This ensures createdAt and updatedAt fields are included

const PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
