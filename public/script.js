// script.js
// This file handles the frontend logic:
// - Fetching items from the backend (Read)
// - Sending new items to the backend (Create)
// - Updating items (Update)
// - Deleting items (Delete)
// It uses the Fetch API to talk to our Express REST API.

const API_URL = "/api/items"; // same origin, so no need for full http://localhost:3000

// Get references to HTML elements
const nameInput = document.getElementById("nameInput");
const priceInput = document.getElementById("priceInput");
const editIdInput = document.getElementById("editId");
const submitBtn = document.getElementById("submitBtn");
const tableBody = document.getElementById("itemTableBody");
const statusMsg = document.getElementById("statusMsg");

// Shows a short green success message, like "Item added successfully"
function showStatus(text) {
  statusMsg.textContent = text;
  setTimeout(() => {
    statusMsg.textContent = "";
  }, 3000);
}

// ----------------------------
// READ: Load all items and show them in the table
// ----------------------------
async function loadItems() {
  const response = await fetch(API_URL);
  const items = await response.json();

  // Clear the table first
  tableBody.innerHTML = "";

  // Add one row per item
  items.forEach((item) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${item.id}</td>
      <td>${item.name}</td>
      <td>${item.price}</td>
      <td>
        <button class="edit-btn" onclick="startEdit(${item.id}, '${item.name}', ${item.price})">Edit</button>
        <button class="delete-btn" onclick="deleteItem(${item.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

// ----------------------------
// CREATE or UPDATE (same Submit button does both)
// ----------------------------
async function handleSubmit() {
  const name = nameInput.value.trim();
  const price = priceInput.value.trim();
  const editId = editIdInput.value;

  if (!name || !price) {
    alert("Please enter both Name and Price");
    return;
  }

  if (editId) {
    // We are editing an existing item -> use PUT
    await fetch(`${API_URL}/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price })
    });
    showStatus("Item updated successfully");
  } else {
    // We are adding a new item -> use POST
    await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, price })
    });
    showStatus("Item added successfully");
  }

  resetForm();
  loadItems();
}

// ----------------------------
// Fill the form with an item's data when Edit is clicked
// ----------------------------
function startEdit(id, name, price) {
  nameInput.value = name;
  priceInput.value = price;
  editIdInput.value = id;
  submitBtn.textContent = "Update";
}

// ----------------------------
// DELETE: Remove an item
// ----------------------------
async function deleteItem(id) {
  const confirmDelete = confirm("Are you sure you want to delete this item?");
  if (!confirmDelete) return;

  await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });

  showStatus("Item deleted successfully");
  loadItems();
}

// ----------------------------
// Reset the form back to "Add" mode
// ----------------------------
function resetForm() {
  nameInput.value = "";
  priceInput.value = "";
  editIdInput.value = "";
  submitBtn.textContent = "Submit";
}

// Load items as soon as the page opens
loadItems();
