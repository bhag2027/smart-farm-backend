
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor", required: true }, // Assuming products are linked to vendors
  quantity: { type: Number, required: true },
  bookingDate: { type: Date, required: true },
  status:{
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'returned'], 
    default: 'pending'
}

});
const BookingModel = mongoose.model('Booking', bookingSchema);
module.exports =BookingModel
