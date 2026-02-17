const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 3000;

app.use(express.json());

// Load products from JSON file
let products = JSON.parse(fs.readFileSync("products.json", "utf8"));

// Function to save products to file
function saveProducts() {
    fs.writeFileSync("products.json", JSON.stringify(products, null, 2));
}

app.get("/welcome", (req, res) => {
res.send("Welcome to the REST API!");
});

app.get("/api/products", (req, res) => {
res.json(products);
});

app.get("/api/products/:id", (req, res) => {
const productId = parseInt(req.params.id);
const product = products.find(p => p.id === productId);
if (product) {
res.json(product);
} else {
res.status(404).json({ error: "Product not found" });
}
});

app.post("/api/products", (req, res) => {
const { name, price } = req.body;
if (!name || !price) {
return res.status(400).json({ error: "Name and price are required" });
}
const newProduct = {
id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
name,
price
};
products.push(newProduct);
saveProducts();
res.status(201).json({
message: "Product created successfully",
product: newProduct
});
});

app.put("/api/products/:id", (req, res) => {
const productId = parseInt(req.params.id);
const { name, price } = req.body;
const productIndex = products.findIndex(p => p.id === productId);
if (productIndex === -1) {
return res.status(404).json({ error: "Product not found" });
}
if (name !== undefined) {
products[productIndex].name = name;
}
if (price !== undefined) {
products[productIndex].price = price;
}
saveProducts();
res.json({
message: "Product updated successfully",
product: products[productIndex]
});
});

app.delete("/api/products/:id", (req, res) => {
const productId = parseInt(req.params.id);
const productIndex = products.findIndex(p => p.id === productId);
if (productIndex === -1) {
return res.status(404).json({ 
message: "Product not found",
success: false 
});
}
const deletedProduct = products[productIndex];
products.splice(productIndex, 1);
saveProducts();
res.json({
message: "Product deleted successfully",
success: true,
product: deletedProduct
});
});


app.use(express.static("public"));

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});