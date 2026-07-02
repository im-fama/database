const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  quantity: { type: Number, required: true, min: 1 },
  priceAtPurchase: { type: Number, required: true } // snapshot, price may change later
}, { _id: false });

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  items: { type: [orderItemSchema], required: true },
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'cancelled'], default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
