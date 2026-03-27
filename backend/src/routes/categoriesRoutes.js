const express = require("express");
const pool = require("../config/db");

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories ORDER BY id"
    );

    res.json({
      success: true,
      categories: result.rows,
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

module.exports = router;