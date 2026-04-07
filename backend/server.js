const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const pool = require("./src/config/db");
const sourcesRoutes = require("./src/routes/sourcesRoutes");
const adminRoutes = require("./src/routes/adminRoutes");
const authRoutes = require("./src/routes/authRoutes");
const votesRoutes = require("./src/routes/votesRoutes");
const bookmarksRoutes = require("./src/routes/bookmarksRoutes");
const categoriesRoutes = require("./src/routes/categoriesRoutes");
const externalRoutes = require("./src/routes/externalRoutes");


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("RelayFlow API is running...");
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
app.use("/api/votes", votesRoutes);
app.use("/api/bookmarks", bookmarksRoutes);
app.use("/api/categories", categoriesRoutes);
app.use("/api/external", externalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});