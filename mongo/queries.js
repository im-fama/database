// 3 queries equivalent to postgres/queries.js
// Usage: MONGO_URI="<your atlas/local uri>" node queries.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(MONGO_URI);

  // 1. All orders for a given user, with product names populated (reference lookup)
  const aisha = await User.findOne({ email: 'aisha@example.com' });
  const aishaOrders = await Order.find({ user: aisha._id }).populate('items.product', 'name price');
  console.log('\n--- Query 1: Orders for Aisha ---');
  console.log(JSON.stringify(aishaOrders, null, 2));

  // 2. Total revenue per product category (aggregation pipeline: unwind, lookup, group)
  const revenueByCategory = await Order.aggregate([
    { $unwind: '$items' },
    { $lookup: { from: 'products', localField: 'items.product', foreignField: '_id', as: 'product' } },
    { $unwind: '$product' },
    {
      $group: {
        _id: '$product.category',
        totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.priceAtPurchase'] } }
      }
    },
    { $sort: { totalRevenue: -1 } }
  ]);
  console.log('\n--- Query 2: Revenue by category ---');
  console.log(revenueByCategory);

  // 3. Top spending customers (group orders by user, sum totalAmount)
  const topCustomers = await Order.aggregate([
    { $group: { _id: '$user', totalSpent: { $sum: '$totalAmount' }, orderCount: { $sum: 1 } } },
    { $sort: { totalSpent: -1 } },
    { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
    { $unwind: '$user' },
    { $project: { _id: 0, name: '$user.name', totalSpent: 1, orderCount: 1 } }
  ]);
  console.log('\n--- Query 3: Top spending customers ---');
  console.log(topCustomers);

  await mongoose.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
