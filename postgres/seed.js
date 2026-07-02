// Usage: PG_URI="postgres://user:pass@host:5432/dbname" node seed.js
const { sequelize, User, Product, Order, OrderItem } = require('./models');

async function seed() {
  await sequelize.sync({ force: true }); // drops & recreates tables

  const [aisha, bilal] = await User.bulkCreate([
    { name: 'Aisha Khan', email: 'aisha@example.com', password: 'hashed_pw_1', role: 'customer' },
    { name: 'Bilal Ahmed', email: 'bilal@example.com', password: 'hashed_pw_2', role: 'customer' },
    { name: 'Sara Iqbal', email: 'sara@example.com', password: 'hashed_pw_3', role: 'admin' }
  ]);

  const [mouse, keyboard, tshirt, mug] = await Product.bulkCreate([
    { name: 'Wireless Mouse', description: 'Ergonomic 2.4GHz mouse', price: 1500, stock: 50, category: 'Electronics' },
    { name: 'Mechanical Keyboard', description: 'RGB backlit, blue switches', price: 6500, stock: 30, category: 'Electronics' },
    { name: 'Cotton T-Shirt', description: 'Plain crew neck', price: 900, stock: 100, category: 'Apparel' },
    { name: 'Coffee Mug', description: 'Ceramic, 350ml', price: 450, stock: 200, category: 'Home' }
  ]);

  const order1 = await Order.create({ userId: aisha.id, totalAmount: 2 * 1500 + 900, status: 'paid' });
  await OrderItem.bulkCreate([
    { orderId: order1.id, productId: mouse.id, quantity: 2, priceAtPurchase: mouse.price },
    { orderId: order1.id, productId: tshirt.id, quantity: 1, priceAtPurchase: tshirt.price }
  ]);

  const order2 = await Order.create({ userId: bilal.id, totalAmount: 6500, status: 'pending' });
  await OrderItem.create({ orderId: order2.id, productId: keyboard.id, quantity: 1, priceAtPurchase: keyboard.price });

  const order3 = await Order.create({ userId: aisha.id, totalAmount: 4 * 450, status: 'shipped' });
  await OrderItem.create({ orderId: order3.id, productId: mug.id, quantity: 4, priceAtPurchase: mug.price });

  console.log('Seed complete: 3 users, 4 products, 3 orders');
  await sequelize.close();
}

seed().catch(err => { console.error(err); process.exit(1); });
