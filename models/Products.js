const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  description: String,
  image: String,
}, { timestamps: true });

// Register the Product model with the correct name 'Product'
const ProductModel = mongoose.model('Product', productSchema);
module.exports = ProductModel;


// const mongoose = require("mongoose");

// const productSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     stock: { type: Number, required: true },
//     description: { type: String, required: true },
//     vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendors", required: true }, // Ensure this field exists and references the correct model
// });

// const ProductModel = mongoose.model('Product', productSchema);
// module.exports = ProductModel;
