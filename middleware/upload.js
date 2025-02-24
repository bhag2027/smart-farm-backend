// /middleware/upload.js

const multer = require('multer');

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');  // Store files in the 'uploads' folder (Make sure it exists)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);  // Make the file name unique by prepending the current timestamp
  }
});

// Create the multer instance with the defined storage configuration
const upload = multer({ storage: storage });

// Export the upload instance to use it in routes
module.exports = upload;
