// server.js
// This is the backend server. It uses Express.js to create REST API endpoints
// for Create, Read, Update, and Delete (CRUD) operations.
// Items are stored in a simple JavaScript array (no database used).

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());                 // allow frontend to call this backend
app.use(express.json());         // allow server to read JSON from requests
app.use(express.static(path.join(__dirname, "public"))); // serve frontend files

// ----------------------------
// In-memory "database" (array)
// ----------------------------
let items = [
  { id: 1, name: "Book", price: 250 },
  { id: 2, name: "Pen", price: 25 }
];

// This keeps track of the next ID to use for a new item.
let nextId = 3;

// ----------------------------
// REST API Routes
// ----------------------------

// READ: Get all items
app.get("/api/items", (req, res) => {
  res.json(items);
});

// CREATE: Add a new item
app.post("/api/items", (req, res) => {
  const { name, price } = req.body;

  // Basic validation
  if (!name || price === undefined || price === "") {
    return res.status(400).json({ message: "Name and Price are required" });
  }

  const newItem = {
    id: nextId,
    name: name,
    price: Number(price)
  };

  nextId = nextId + 1;
  items.push(newItem);

  res.status(201).json(newItem);
});

// UPDATE: Edit an existing item by ID
app.put("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);
  const { name, price } = req.body;

  const item = items.find((i) => i.id === id);

  if (!item) {
    return res.status(404).json({ message: "Item not found" });
  }

  if (!name || price === undefined || price === "") {
    return res.status(400).json({ message: "Name and Price are required" });
  }

  item.name = name;
  item.price = Number(price);

  res.json(item);
});

// DELETE: Remove an item by ID
app.delete("/api/items/:id", (req, res) => {
  const id = Number(req.params.id);

  const itemExists = items.some((i) => i.id === id);

  if (!itemExists) {
    return res.status(404).json({ message: "Item not found" });
  }

  items = items.filter((i) => i.id !== id);

  res.json({ message: "Item deleted successfully" });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
