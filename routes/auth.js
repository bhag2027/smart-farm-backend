const express = require('express');
const bcrypt = require('bcrypt');

const vendormodel = require('../models/vendor');
const usermodel = require('../models/users');
 // Import admin model
const adminModel = require('../models/adminmodel');

const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Check vendor first
    const vendor = await vendormodel.findOne({ v_email: email });
    if (vendor) {
        const isMatch = await bcrypt.compare(password, vendor.v_password);
        if (isMatch) {
            return res.json({ success: true, userType: 'vendor', role: vendor.role });
        }
    }

    // Check user next
    const user = await usermodel.findOne({ email });
    if (user) {
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.json({ success: true, userType: 'user', role: user.role });
        }
    }

    return res.status(401).json({ success: false, message: 'Invalid credentials' });
});
module.exports = router;
