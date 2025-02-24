// const jwt = require('jsonwebtoken');
// const usermodel = require('../models/users'); // Ensure the model path is correct

// // Use an environment variable for the JWT secret key
// const JWT_SECRET = process.env.JWT_SECRET || 'myhardcodedsecret'; // Fallback for development

// const authenticateUser = async (req, res, next) => {
//     const token = req.header('x-auth-token');
//     console.log('Received token:', token); // Log the received token

//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'myhardcodedsecret');
//         console.log('Decoded token:', decoded); // Log decoded token details

//         req.user = await UserModel.findById(decoded.user.id);
//         if (!req.user) {
//             return res.status(401).json({ msg: 'User not found' });
//         }

//         next();
//     } catch (error) {
//         console.error("Authentication Error: ", error);
//         res.status(401).json({ msg: 'Token is not valid', error: error.message });
//     }
// };

// module.exports = authenticateUser;
const jwt = require('jsonwebtoken');
const userModel = require('../models/users'); // Ensure the path is correct

const JWT_SECRET = process.env.JWT_SECRET || 'myhardcodedsecret'; // Replace with your secret

const authenticateUser = async (req, res, next) => {
    const token = req.header('x-auth-token'); // Use the correct header name

    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET); // Verify token
        req.user = await userModel.findById(decoded.user.id); // Find the user
        if (!req.user) {
            return res.status(401).json({ msg: 'User not found' });
        }
        next(); // Proceed to the next middleware/route handler
    } catch (error) {
        console.error("Authentication Error: ", error);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authenticateUser;
