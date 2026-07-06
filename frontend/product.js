const API_URL = "http://localhost:5000/api/products"

const detailsDiv = document.getElementById("details")

// Get ID from URL
const params = new URLSearchParams(window.location.search)
const id = params.get("id")

async function getProduct() {
  try {
    const res = await fetch(`${API_URL}/${id}`)
    const product = await res.json()

    detailsDiv.innerHTML = `
      <h2>${product.title}</h2>
      <img src="${product.image}" width="200"/>
      <p><strong>Price:</strong> $${product.price}</p>
      <p>${product.description}</p>
    `
  } catch (error) {
    console.error(error)
    detailsDiv.innerHTML = "<p>Error loading product</p>"
  }
}

getProduct()