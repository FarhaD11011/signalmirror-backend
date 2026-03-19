const express = require("express");
const dotenv = require("dotenv");
const pool = require("./src/config/db");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ middleware
app.use(express.json());

// ✅ basic route
app.get("/", (req, res) => {
  res.send("EchoFlow API is running...");
});

// ✅ DB test route
app.get("/db-test", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connection successful",
      time: result.rows[0].now,
    });
  } catch (error) {
    console.error("DB connection error:", error.message);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// ✅ start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});