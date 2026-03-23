const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ POST /api/votes
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { source_id, vote_type } = req.body;
    const user_id = req.user.id;

    // ✅ validate source_id
    if (!source_id || typeof source_id !== "number") {
      return res.status(400).json({
        message: "Valid source_id is required",
      });
    }

    // ✅ validate vote_type
    if (vote_type !== "up" && vote_type !== "down") {
      return res.status(400).json({
        message: "vote_type must be 'up' or 'down'",
      });
    }

    // ✅ optional: make sure source exists
    const sourceCheck = await pool.query(
      "SELECT id FROM sources WHERE id = $1",
      [source_id]
    );

    if (sourceCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Source not found",
      });
    }

    // ✅ insert new vote or update existing one
    const result = await pool.query(
      `
      INSERT INTO votes (user_id, source_id, vote_type)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, source_id)
      DO UPDATE SET vote_type = EXCLUDED.vote_type, created_at = CURRENT_TIMESTAMP
      RETURNING *;
      `,
      [user_id, source_id, vote_type]
    );

    res.status(201).json({
      success: true,
      message: "Vote saved successfully",
      vote: result.rows[0],
    });
  } catch (error) {
    console.error("Vote error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to save vote",
      error: error.message,
    });
  }
});

module.exports = router;