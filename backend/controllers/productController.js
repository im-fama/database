const axios = require('axios')

// GET all products
const getProducts = async (req, res) => {
  try {
    const response = await axios.get('https://fakestoreapi.com/products')
    res.json(response.data)
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" })
  }
}

// GET product by ID
const getProductById = async (req, res) => {
  try {
    const response = await axios.get(
      `https://fakestoreapi.com/products/${req.params.id}`
    )
    res.json(response.data)
  } catch (error) {
    res.status(404).json({ message: "Product not found" })
  }
}

module.exports = { getProducts, getProductById }