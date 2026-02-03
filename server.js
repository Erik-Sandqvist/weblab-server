const express = require("express");
const app = express();
const PORT = 3000;

let products = [
{ id: 1, name: "Laptop", price: 1000 },
{ id: 2, name: "Phone", price: 500 },
{ id: 3, name: "Tablet", price: 300 },
{ id: 4, name: "Monitor", price: 200 }
];

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

// Serve static files from the public directory
app.use(express.static("public"));

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});