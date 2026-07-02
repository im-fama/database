const { DataTypes } = require('sequelize');
const sequelize = require('../db');

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'admin'), defaultValue: 'customer' }
});

const Product = sequelize.define('Product', {
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: '' },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  category: { type: DataTypes.STRING, allowNull: false }
});

const Order = sequelize.define('Order', {
  totalAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  status: { type: DataTypes.ENUM('pending', 'paid', 'shipped', 'cancelled'), defaultValue: 'pending' }
});

// Join table for the many-to-many Order <-> Product relationship,
// equivalent to the embedded `items` array in the Mongo Order model.
const OrderItem = sequelize.define('OrderItem', {
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  priceAtPurchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

// Associations
User.hasMany(Order, { foreignKey: 'userId' });
Order.belongsTo(User, { foreignKey: 'userId' });

Order.belongsToMany(Product, { through: OrderItem, foreignKey: 'orderId' });
Product.belongsToMany(Order, { through: OrderItem, foreignKey: 'productId' });

module.exports = { sequelize, User, Product, Order, OrderItem };
