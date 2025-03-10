const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { Parser } = require("json2csv");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

// Load credentials from environment variables
const API_SECRET_TOKEN = process.env.API_SECRET_TOKEN;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;

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

// Middleware for Basic Authentication (Username & Password)
const basicAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.setHeader("WWW-Authenticate", 'Basic realm="Secure Area"');
    return res.status(401).json({ message: "Authentication required" });
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
  const [username, password] = credentials.split(":");

  if (username !== AUTH_USERNAME || password !== AUTH_PASSWORD) {
    return res.status(403).json({ message: "Forbidden: Invalid Credentials" });
  }

  next();
};

// Secured API Route to Get Data and Download CSV (Token + Basic Auth Required)
app.get("/api/data", authenticateToken, basicAuth, async (req, res) => {
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
