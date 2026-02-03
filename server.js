const express = require("express");
const app = express();
const PORT = 3000;

// Serve static files from the public directory
app.use(express.static("public"));

app.get("/welcome", (req, res) => {
res.send("Welcome to the REST API!");
});

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});