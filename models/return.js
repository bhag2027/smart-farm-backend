const mongoose = require('mongoose');

const ReturnSchema = new mongoose.Schema({
  product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },  // Reference to Product model
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },        // Reference to User model
  return_reason: { type: String, required: true },                                       // Reason for return
  vendor_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },    // Reference to Vendor model
  return_date: { type: Date, default: Date.now }                                         // Return date, default to current date
});

const returnmodel = mongoose.model('Return', ReturnSchema);
module.exports =returnmodel;

