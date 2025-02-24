// /middleware/authenticateVendor.js

const authenticateVendor = (req, res, next) => {
    if (req.user && req.user.role === 'vendor') {  // Assuming req.user is set by a previous authentication middleware (e.g., JWT auth)
      return next();  // Proceed to the next middleware or route handler
    }
    return res.status(403).json({ message: 'Access denied, only vendors can add products' });
  };
  
  module.exports = authenticateVendor;
  