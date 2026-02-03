console.log("hello from start.js");

async function fetchProducts() {
    try {
        const response = await fetch('/api/products');
        const products = await response.json();
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

console.log(await fetchProducts());

async function fetchProductsByID(id) {
    try {
        const response = await fetch(`/api/products/${id}`);
        if (!response.ok) {
            throw new Error(`Product with id ${id} not found`);
        }
        const product = await response.json();
        return product;
    } catch (error) {
        console.error('Error fetching product:', error);
        return null;
    }
}

const laptop = await fetchProductsByID(1);
console.log(laptop);

async function displayProducts() {
    const products = await fetchProducts();
    const container = document.getElementById('products-container');
    
    if (products.length === 0) {
        container.innerHTML = '<p>No products available</p>';
        return;
    }
    
    const productsList = products.map(product => `
        <div class="product">
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>ID: ${product.id}</p>
        </div>
    `).join('');
    
    container.innerHTML = productsList;
}

// Load and display products when page loads
displayProducts();


