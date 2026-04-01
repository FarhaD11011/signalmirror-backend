const express = require("express");
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ✅ POST /api/bookmarks
// add bookmark for logged-in user
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { source_id } = req.body;
    const user_id = req.user.id;
    // ✅ validate source_id
    if (!source_id || typeof source_id !== "number") {
      return res.status(400).json({
        message: "Valid source_id is required",
      });
    }
    // ✅ check source exists
    const sourceCheck = await pool.query(
      "SELECT id FROM sources WHERE id = $1",
      [source_id]
    );
    if (sourceCheck.rows.length === 0) {
      return res.status(404).json({
        message: "Source not found",
      });
    }
    // ✅ insert bookmark, ignore duplicates gracefully
    const result = await pool.query(
      `
      INSERT INTO bookmarks (user_id, source_id)
      VALUES ($1, $2)
      ON CONFLICT (user_id, source_id)
      DO NOTHING
      RETURNING *;
      `,
      [user_id, source_id]
    );
    // ✅ if already bookmarked
    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        message: "Source already bookmarked",
      });
    }
    res.status(201).json({
      success: true,
      message: "Bookmark added successfully",
      bookmark: result.rows[0],
    });
  } catch (error) {
    console.error("Bookmark error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to add bookmark",
      error: error.message,
    });
  }
});

// ✅ GET /api/bookmarks
// get bookmarks for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await pool.query(
      `
      SELECT
        bookmarks.id AS bookmark_id,
        bookmarks.created_at AS bookmarked_at,
        sources.id AS source_id,
        sources.title,
        sources.url,
        sources.summary,
        sources.image_url,
        sources.platform,
        sources.status,
        sources.category_id,
        sources.submitter_id,
        sources.created_at
      FROM bookmarks
      JOIN sources ON bookmarks.source_id = sources.id
      WHERE bookmarks.user_id = $1
      ORDER BY bookmarks.created_at DESC;
      `,
      [user_id]
    );
    res.json({
      success: true,
      count: result.rows.length,
      bookmarks: result.rows,
    });
  } catch (error) {
    console.error("Fetch bookmarks error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookmarks",
      error: error.message,
    });
  }
});


// ✅ DELETE /api/bookmarks/:sourceId
// remove bookmark for logged-in user
router.delete("/:sourceId", authMiddleware, async (req, res) => {
  try {
    const user_id = req.user.id;
    const sourceId = Number(req.params.sourceId);
    if (!sourceId) {
      return res.status(400).json({
        message: "Valid sourceId is required",
      });
    }
    const result = await pool.query(
      `
      DELETE FROM bookmarks
      WHERE user_id = $1 AND source_id = $2
      RETURNING *;
      `,
      [user_id, sourceId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bookmark not found",
      });
    }
    res.json({
      success: true,
      message: "Bookmark removed successfully",
      bookmark: result.rows[0],
    });
  } catch (error) {
    console.error("Delete bookmark error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to remove bookmark",
      error: error.message,
    });
  }
});

module.exports = router;