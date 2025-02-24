

const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for ObjectId validation
const BookingModel = require('../models/bookmodel'); // Ensure this imports your Booking model
const router = express.Router();
const { searchUserBookings } = require('../controllers/bookingController');
const authenticate = require('../middleware/authenticateUser'); 
// Middleware to validate ObjectId
const validateObjectId = (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
        return res.status(400).json({ success: false, message: 'Invalid user ID format' });
    }
    next();
};

// GET /user-bookings/:userId
router.get('/user-bookings/:userId', validateObjectId, async (req, res) => {
    const { userId } = req.params;
    console.log(`Fetching bookings for userId: ${userId}`);

    try {
        const bookings = await BookingModel.find({ user: userId })
            .populate('product', 'name') // Get product name
            .populate('vendor', 'v_name') // Get vendor name
            .exec();

        console.log(`Bookings found: ${bookings.length} bookings retrieved`);

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'No bookings found' });
        }

        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
});


// router.get('/search', authenticate, searchUserBookings);
module.exports = router;
