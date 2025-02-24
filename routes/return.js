// // routes/returns.js

// const express = require('express');
//  // Adjust the path as needed
// const returnmodel = require('../models/return');
// const router = express.Router();

// // Route to get return details for a specific vendor
// // router.get('/vendor/returns', async (req, res) => {
// //   const { vendorId } = req.query; // Get vendorId from the query parameters

// //   try {
// //     // Find return requests for the vendor and populate user and product details
// //     const returns = await returnmodel.find({ vendor_id: vendorId })
// //       .populate('user_id', 'name address phone') // Populate user details
// //       .populate('product_id', 'name'); // Populate product name

// //     // Check if returns were found
// //     if (!returns || returns.length === 0) {
// //       return res.status(404).json({ message: 'No return requests found' });
// //     }

// //     // Send the return requests as the response
// //     res.status(200).json(returns);
// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: 'Server error' });
// //   }
// // });

// module.exports = router;
