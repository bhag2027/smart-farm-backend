// // bookingController.js
// const BookingModel = require('../models/bookmodel');
// const ProductModel = require('../models/Products');

// // Search booked products by product name
// const searchUserBookings = async (req, res) => {
//   const { userId } = req.user;  // Assuming user is authenticated and userId is available in the token
//   const { productName } = req.query;

//   try {
//     // Find products by name
//     const products = await ProductModel.find({ name: new RegExp(productName, 'i') });
    
//     if (!products.length) {
//       return res.status(404).json({ message: 'No products found with the given name' });
//     }

//     // Find bookings for those products and the authenticated user
//     const bookings = await BookingModel.find({
//       user: userId,
//       product: { $in: products.map(product => product._id) },
//     }).populate('product vendor', 'name v_name');  // Populate product name and vendor details

//     if (!bookings.length) {
//       return res.status(404).json({ message: 'No bookings found for the searched product' });
//     }

//     res.status(200).json(bookings);
//   } catch (error) {
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// module.exports = { searchUserBookings };
