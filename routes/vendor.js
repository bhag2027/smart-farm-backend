// routes/vendorBookings.js
const express = require('express');
const BookingModel = require('../models/bookmodel'); // Ensure this imports your Booking model
const returnmodel = require('../models/return');
const router = express.Router();
const mongoose = require('mongoose');

// GET /vendor-bookings/:vendorId
// GET /vendor-bookings/:vendorId
// routes/vendorBookings.js


// GET /vendor-bookings/:vendorId
// router.get('/vendor-bookings/:vendorId', async (req, res) => {
//     const { vendorId } = req.params;
//     console.log(`Fetching bookings for vendorId: ${vendorId}`);

//     try {
//         const bookings = await BookingModel.find({ vendor: vendorId })
//             .populate('product', 'name') // Get product name
//             .populate('user', 'name') // Get user name if needed
//             .exec();

//         console.log(`Bookings found: ${bookings}`);

//         if (!bookings || bookings.length === 0) {
//             return res.status(404).json({ success: false, message: 'No bookings found' });
//         }

//         res.json({ success: true, bookings });
//     } catch (error) {
//         console.error('Error fetching bookings:', error);
//         res.status(500).json({ success: false, message: 'Error fetching bookings' });
//     }
// });

// // POST /update-booking/:bookingId
// router.post('/update-booking/:bookingId', async (req, res) => {
//     const { bookingId } = req.params;
//     const { isAccepted } = req.body;

//     console.log(`Updating booking ${bookingId} with acceptance status: ${isAccepted}`);

//     try {
//         const updatedBooking = await BookingModel.findByIdAndUpdate(bookingId, 
//             { status: isAccepted ? 'accepted' : 'rejected' }, 
//             { new: true }
//         );

//         if (!updatedBooking) {
//             return res.status(404).json({ success: false, message: 'Booking not found' });
//         }

//         res.json({ success: true, message: `Booking has been ${isAccepted ? 'accepted' : 'rejected'}` });
//     } catch (error) {
//         console.error('Error updating booking:', error);
//         res.status(500).json({ success: false, message: 'Error updating booking' });
//     }
// });

// // GET /vendor-bookings/:vendorId
router.get('/vendor-bookings/:vendorId', async (req, res) => {
    const { vendorId } = req.params;
    console.log(`Fetching bookings for vendorId: ${vendorId}`);

    try {
        const bookings = await BookingModel.find({ vendor: vendorId })
            .populate('product', 'name') // Get product name
            // .populate('user', 'name') // Get user name
            .populate('user', 'name phno address') 
            .exec();

        console.log(`Bookings found: ${bookings}`);

        if (!bookings || bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'No bookings found' });
        }

        res.json({ success: true, bookings });
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ success: false, message: 'Error fetching bookings' });
    }
});


// POST /update-booking/:bookingId
router.post('/update-booking/:bookingId', async (req, res) => {
    const { bookingId } = req.params;
    const { isAccepted } = req.body;

    console.log(`Updating booking ${bookingId} with acceptance status: ${isAccepted}`);

    try {
        const updatedBooking = await BookingModel.findByIdAndUpdate(bookingId, 
            { status: isAccepted ? 'accepted' : 'rejected' }, 
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ success: false, message: 'Booking not found' });
        }

        res.json({ success: true, message: `Booking has been ${isAccepted ? 'accepted' : 'rejected'}` });
    } catch (error) {
        console.error('Error updating booking:', error);
        res.status(500).json({ success: false, message: 'Error updating booking' });
    }
});


module.exports = router;


