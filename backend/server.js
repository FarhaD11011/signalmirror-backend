const express = require("express");
const dotenv = require("dotenv");
const pool = require("./src/config/db");
const sourcesRoutes = require("./src/routes/sourcesRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");
const votesRoutes = require("./src/routes/votesRoutes");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("EchoFlow API is running...");
});

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

app.use("/api/sources", sourcesRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/auth", authRoutes);

app.use("/api/votes", votesRoutes)





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});