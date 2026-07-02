const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.PG_URI || 'postgres://postgres:postgres@127.0.0.1:5432/ecommerce_db',
  { logging: false }
);

module.exports = sequelize;
