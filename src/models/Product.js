const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    vendor: { type: mongoose.Schema.Types.ObjectId, ref: 'Vendor', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
