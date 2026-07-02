// 3 queries equivalent to mongo/queries.js
// Usage: PG_URI="postgres://user:pass@host:5432/dbname" node queries.js
const { sequelize, User, Product, Order, OrderItem } = require('./models');

async function run() {
  // 1. All orders for a given user, with product names joined in
  const aisha = await User.findOne({ where: { email: 'aisha@example.com' } });
  const aishaOrders = await Order.findAll({
    where: { userId: aisha.id },
    include: [{ model: Product, through: { attributes: ['quantity', 'priceAtPurchase'] } }]
  });
  console.log('\n--- Query 1: Orders for Aisha ---');
  console.log(JSON.stringify(aishaOrders, null, 2));

  // 2. Total revenue per product category (JOIN + GROUP BY)
  const [revenueByCategory] = await sequelize.query(`
    SELECT p.category, SUM(oi.quantity * oi."priceAtPurchase") AS "totalRevenue"
    FROM "OrderItems" oi
    JOIN "Products" p ON p.id = oi."productId"
    GROUP BY p.category
    ORDER BY "totalRevenue" DESC;
  `);
  console.log('\n--- Query 2: Revenue by category ---');
  console.log(revenueByCategory);

  // 3. Top spending customers (JOIN + GROUP BY)
  const [topCustomers] = await sequelize.query(`
    SELECT u.name, SUM(o."totalAmount") AS "totalSpent", COUNT(o.id) AS "orderCount"
    FROM "Orders" o
    JOIN "Users" u ON u.id = o."userId"
    GROUP BY u.name
    ORDER BY "totalSpent" DESC;
  `);
  console.log('\n--- Query 3: Top spending customers ---');
  console.log(topCustomers);

  await sequelize.close();
}

run().catch(err => { console.error(err); process.exit(1); });
