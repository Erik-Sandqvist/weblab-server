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
            <button onclick="fillUpdateForm(${product.id}, '${product.name}', ${product.price})">Edit</button>
            <button onclick="handleDeleteProduct(${product.id})">Delete</button>
        </div>
    `).join('');
    
    container.innerHTML = productsList;
}

function fillUpdateForm(id, name, price) {
    document.getElementById('update-id').value = id;
    document.getElementById('update-name').value = name;
    document.getElementById('update-price').value = price;
}

async function handleDeleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        const result = await deleteProduct(id);
        if (result && result.success) {
            await displayProducts();
        } else {
            alert('Failed to delete product');
        }
    }
}

// Make functions available globally
window.fillUpdateForm = fillUpdateForm;
window.handleDeleteProduct = handleDeleteProduct;

async function addProduct(name, price) {
    try {
        const response = await fetch('/api/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, price })
        });
        
        if (!response.ok) {
            throw new Error('Failed to add product');
        }
        
        const newProduct = await response.json();
        console.log('Product added:', newProduct);
        return newProduct;
    } catch (error) {
        console.error('Error adding product:', error);
        return null;
    }
}

async function updateProduct(id, name, price) {
    try {
        const body = {};
        if (name !== undefined) body.name = name;
        if (price !== undefined) body.price = price;
        
        const response = await fetch(`/api/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        
        if (!response.ok) {
            throw new Error('Failed to update product');
        }
        
        const result = await response.json();
        console.log('Product updated:', result);
        return result;
    } catch (error) {
        console.error('Error updating product:', error);
        return null;
    }
}

async function deleteProduct(id) {
    try {
        const response = await fetch(`/api/products/${id}`, {
            method: 'DELETE'
        });
        
        if (!response.ok) {
            throw new Error('Failed to delete product');
        }
        
        const result = await response.json();
        console.log('Product deleted:', result);
        return result;
    } catch (error) {
        console.error('Error deleting product:', error);
        return null;
    }
}

document.getElementById('product-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    
    const newProduct = await addProduct(name, price);
    
    if (newProduct) {
        // Clear form
        e.target.reset();
        // Refresh product list
        await displayProducts();
    } else {
        alert('Failed to add product');
    }
});

document.getElementById('update-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const id = parseInt(document.getElementById('update-id').value);
    const name = document.getElementById('update-name').value;
    const price = document.getElementById('update-price').value;
    
    const result = await updateProduct(
        id,
        name || undefined,
        price ? parseFloat(price) : undefined
    );
    
    if (result) {
        // Clear form
        e.target.reset();
        // Refresh product list
        await displayProducts();
    } else {
        alert('Failed to update product');
    }
});

// Load and display products when page loads
displayProducts();
