const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Parser } = require("json2csv");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Secret Token (Set this in your .env file)
const API_SECRET_TOKEN = process.env.API_SECRET_TOKEN;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB Connection Error:", err));

// Define Schema & Model
const dataSchema = new mongoose.Schema({ name: String, age: Number, email: String });
const DataModel = mongoose.model("data", dataSchema, "data");

// Middleware to verify token
const authenticateToken = (req, res, next) => {
  const token = req.query.token || req.headers["x-api-key"]; // Check token from query or header

  if (!token || token !== API_SECRET_TOKEN) {
    return res.status(403).json({ message: "Forbidden: Invalid Token" });
  }
  next();
};

// Test Route
app.get("/", (req, res) => {
  res.send("API is running!");
});

// Secured API Route to Get Data and Download CSV
app.get("/api/data", authenticateToken, async (req, res) => {
  try {
    const data = await DataModel.find();

    if (data.length === 0) {
      return res.status(404).json({ message: "No data found" });
    }

    // Convert data to JSON format and exclude MongoDB _id
    const jsonData = data.map(({ _id, ...rest }) => rest);
    
    // Convert JSON to CSV
    const parser = new Parser();
    const csv = parser.parse(jsonData);

    // Set response headers to trigger file download
    res.setHeader("Content-Disposition", "attachment; filename=data.csv");
    res.setHeader("Content-Type", "text/csv");

    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
