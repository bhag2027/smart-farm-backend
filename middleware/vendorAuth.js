const jwt = require('jsonwebtoken');
 // Assuming there's a vendor model
const vendormodel = require('../models/vendor');

const vendorAuth = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    
    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Use your JWT secret
        const vendor = await vendormodel.findById(decoded._id); // Find vendor by decoded ID

        if (!vendor) {
            throw new Error();
        }

        req.vendor = vendor; // Attach vendor to request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate as vendor.' });
    }
};

module.exports = vendorAuth;
