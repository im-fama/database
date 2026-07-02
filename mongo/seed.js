// Seeds sample Users, Products, Orders into MongoDB.
// Usage: MONGO_URI="<your atlas/local uri>" node seed.js
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const mongoose = require('mongoose');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ecommerce_db';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  await Promise.all([User.deleteMany({}), Product.deleteMany({}), Order.deleteMany({})]);

  const users = await User.insertMany([
    { name: 'Aisha Khan', email: 'aisha@example.com', password: 'hashed_pw_1', role: 'customer' },
    { name: 'Bilal Ahmed', email: 'bilal@example.com', password: 'hashed_pw_2', role: 'customer' },
    { name: 'Sara Iqbal', email: 'sara@example.com', password: 'hashed_pw_3', role: 'admin' }
  ]);

  const products = await Product.insertMany([
    { name: 'Wireless Mouse', description: 'Ergonomic 2.4GHz mouse', price: 1500, stock: 50, category: 'Electronics' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit, blue switches', price: 6500, stock: 30, category: 'Electronics' },
    { name: 'Cotton T-Shirt', description: 'Plain crew neck', price: 900, stock: 100, category: 'Apparel' },
    { name: 'Coffee Mug', description: 'Ceramic, 350ml', price: 450, stock: 200, category: 'Home' }
  ]);

  await Order.insertMany([
    {
      user: users[0]._id,
      items: [
        { product: products[0]._id, quantity: 2, priceAtPurchase: products[0].price },
        { product: products[2]._id, quantity: 1, priceAtPurchase: products[2].price }
      ],
      totalAmount: 2 * products[0].price + products[2].price,
      status: 'paid'
    },
    {
      user: users[1]._id,
      items: [{ product: products[1]._id, quantity: 1, priceAtPurchase: products[1].price }],
      totalAmount: products[1].price,
      status: 'pending'
    },
    {
      user: users[0]._id,
      items: [{ product: products[3]._id, quantity: 4, priceAtPurchase: products[3].price }],
      totalAmount: 4 * products[3].price,
      status: 'shipped'
    }
  ]);

  console.log('Seed complete: 3 users, 4 products, 3 orders');
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
