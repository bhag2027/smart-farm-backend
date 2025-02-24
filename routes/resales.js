// const express = require('express');
// const ResaleModel = require('../models/resale');
// const BookingModel = require('../models/bookmodel'); // Import BookingModel to validate the booking
// const router = express.Router();


// // // Route to fetch a user's chicks (bookings)
// // router.get('/user-chicks/:userId', async (req, res) => {
// //     const { userId } = req.params;
  
// //     try {
// //       const bookings = await BookingModel.find({ user: userId, type: 'chicks' }) // Fetch bookings for chicks
// //         .populate('product', 'name') // Get product name
// //         .populate('vendor', 'v_name') // Get vendor name
// //         .exec();
  
// //       // Map through the bookings to modify the product name
// //       const chicks = bookings.map(booking => ({
// //         ...booking._doc, // Spread existing booking data
// //         product: {
// //           ...booking.product._doc,
// //           name: 'Chicks', // Set product name to "Chicks"
// //         },
// //       }));
  
// //       res.json({ success: true, chicks }); // Send modified chicks data
// //     } catch (error) {
// //       console.error('Error fetching user chicks:', error);
// //       res.status(500).json({ success: false, message: 'Error fetching chicks' });
// //     }
// //   });
  
// // // Route to handle resale submission
// // // Route to handle resale submissions
// // router.post('/api/resale', async (req, res) => {
// //     const { chickId, deadChicksCount, totalWeight } = req.body;
  
// //     // Find the booking associated with the chickId
// //     const booking = await BookingModel.findById(chickId);
    
// //     if (!booking) {
// //       return res.status(404).json({ success: false, message: 'Booking not found' });
// //     }
  
// //     try {
// //       // Create new resale entry
// //       const resale = new ResaleModel({
// //         user: booking.user,
// //         product: booking.product,
// //         vendor: booking.vendor,
// //         deadChicksCount,
// //         totalWeight,
// //       });
  
// //       await resale.save();
// //       res.json({ success: true, message: 'Resale submitted successfully!' });
// //     } catch (error) {
// //       console.error('Error submitting resale:', error);
// //       res.status(500).json({ success: false, message: 'Error submitting resale' });
// //     }
// //   });



// module.exports = router;
