# Week 3 Assignment — E-commerce schema in MongoDB & PostgreSQL

Models Users, Products, Orders in both databases, with 3 equivalent queries in each.

## Folder structure
```
mongo/
  models/User.js, Product.js, Order.js   (Mongoose schemas)
  seed.js                                 (inserts sample data)
  queries.js                              (the 3 queries)
postgres/
  models/index.js                         (Sequelize models + associations)
  db.js                                    (connection)
  seed.js
  queries.js
```

## Design decision: embedding vs referencing
- **MongoDB**: `Order.items` is an **embedded array** of `{ product (ref), quantity, priceAtPurchase }`. Embedding avoids a join when reading an order (the common access pattern), while `product` still references `Product._id` so you can populate full product details when needed. `User` and `Product` are separate top-level collections referenced by `_id`.
- **PostgreSQL**: fully normalized. `Orders` references `Users` via `userId` FK. A many-to-many between `Orders` and `Products` is resolved with a join table, `OrderItems`, carrying `quantity` and `priceAtPurchase` — this is the relational equivalent of Mongo's embedded items array.

## The 3 equivalent queries (in both `queries.js` files)
1. All orders for a given user, with product details joined/populated in.
2. Total revenue per product category (join items → products, group by category, sum).
3. Top spending customers (group orders by user, sum totalAmount, sort descending).

## How to run

### PostgreSQL (tested and working in this sandbox)
```bash
cd postgres
npm install        # already done if you got this folder from me
# point at your own Postgres, e.g.:
export PG_URI="postgres://postgres:yourpassword@localhost:5432/ecommerce_db"
node seed.js        # creates tables + inserts sample data
node queries.js      # runs the 3 queries, prints results
```
If you don't have Postgres installed locally yet:
- Mac: `brew install postgresql@16 && brew services start postgresql@16`
- Windows: install via the official Postgres installer (includes pgAdmin)
- Then `createdb ecommerce_db` before running seed.js

### MongoDB
```bash
cd mongo
npm install
# Easiest: free MongoDB Atlas cluster (https://www.mongodb.com/cloud/atlas) — copy your connection string
export MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/ecommerce_db"
# OR install MongoDB Community Server locally and use mongodb://127.0.0.1:27017/ecommerce_db
node seed.js
node queries.js
```
### query output

--- Query 1: Orders for Aisha ---
[
  {
    "_id": "6a45ff7f0493d10b0d9ec9b5",
    "user": "6a45ff7f0493d10b0d9ec9ae",
    "items": [
      {
        "product": {
          "_id": "6a45ff7f0493d10b0d9ec9b1",
          "name": "Wireless Mouse",
          "price": 1500
        },
        "quantity": 2,
        "priceAtPurchase": 1500
      },
      {
        "product": {
          "_id": "6a45ff7f0493d10b0d9ec9b3",
          "name": "Cotton T-Shirt",
          "price": 900
        },
        "quantity": 1,
        "priceAtPurchase": 900
      }
    ],
    "totalAmount": 3900,
    "status": "paid",
    "__v": 0,
    "createdAt": "2026-07-02T06:04:47.988Z",
    "updatedAt": "2026-07-02T06:04:47.988Z"
  },
  {
    "_id": "6a45ff7f0493d10b0d9ec9b7",
    "user": "6a45ff7f0493d10b0d9ec9ae",
    "items": [
      {
        "product": {
          "_id": "6a45ff7f0493d10b0d9ec9b4",
          "name": "Coffee Mug",
          "price": 450
        },
        "quantity": 4,
        "priceAtPurchase": 450
      }
    ],
    "totalAmount": 1800,
    "status": "shipped",
    "__v": 0,
    "createdAt": "2026-07-02T06:04:47.988Z",
    "updatedAt": "2026-07-02T06:04:47.988Z"
  }
]

--- Query 2: Revenue by category ---
[
  { _id: 'Electronics', totalRevenue: 9500 },
  { _id: 'Home', totalRevenue: 1800 },
  { _id: 'Apparel', totalRevenue: 900 }
]

--- Query 3: Top spending customers ---
[
  { totalSpent: 6500, orderCount: 1, name: 'Bilal Ahmed' },
  { totalSpent: 5700, orderCount: 2, name: 'Aisha Khan' }
]
