const express = require('express')
const app = express()
const cors = require("cors")

// middleware
app.use(express.json())
app.use(cors())

// routes
const productRoutes = require('./routes/productRoutes')
app.use('/api/products', productRoutes)

// server
app.listen(5000, () => {
  console.log("Server running on port 5000")
})