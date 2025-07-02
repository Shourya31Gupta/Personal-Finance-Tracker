const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, { dbName: "expense-tracker" })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Mongoose Schema
const transactionSchema = new mongoose.Schema({
  id: Number,
  amount: Number,
  description: String,
  type: {
    type: String,
    enum: ["income", "expense"],
    default: "expense",
    required: true,
  },
  category: {
    type: String,
    default: "General",
    required: true,
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

// Routes
app.get("/", (req, res) => {
  res.send("API is running.");
});

app.get("/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ id: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.get("/transactions/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);
    res.json(transaction);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.post("/transactions", async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.json(newTransaction);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put("/transactions/:id", async (req, res) => {
  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.delete("/transactions/:id", async (req, res) => {
  try {
    const deleted = await Transaction.findByIdAndDelete(req.params.id);
    res.json(deleted);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start server on Render-assigned port or 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});