const mongoose = require('mongoose');

const resaleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
  deadChicksCount: { type: Number, required: true },  // Number of dead chicks
  totalWeight: { type: Number, required: true },      // Total weight of grown chickens in kg
  pickupDate: { type: Date, required: true },     // Date of resale
});

const ResaleModel = mongoose.model('Resale', resaleSchema);
module.exports = ResaleModel;
