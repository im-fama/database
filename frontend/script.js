const API_URL = "http://localhost:5000/api/products"

const productsDiv = document.getElementById("products")

async function getProducts() {
  try {
    const res = await fetch(API_URL)
    const data = await res.json()

    productsDiv.innerHTML = ""

    data.forEach(product => {
      const div = document.createElement("div")

      div.innerHTML = `
        <h3>${product.title}</h3>
        <p>Price: $${product.price}</p>
        <button onclick="viewProduct(${product.id})">
          View Product
        </button>
        <hr/>
      `

      productsDiv.appendChild(div)
    })
  } catch (error) {
    console.error(error)
    productsDiv.innerHTML = "<p>Error loading products</p>"
  }
}

// Redirect to details page
function viewProduct(id) {
  window.location.href = `product.html?id=${id}`
}