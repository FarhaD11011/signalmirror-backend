const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// ✅ GET /api/sources
// public feed: only approved sources
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT *
      FROM sources
      WHERE status = 'approved'
      ORDER BY created_at DESC;
      `
    );
    res.json({
      success: true,
      count: result.rows.length,
      sources: result.rows,
    });
  } catch (error) {
    console.error("Error fetching approved sources:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch approved sources",
      error: error.message,
    });
  }
});

// ✅ POST /api/sources
router.post("/", async (req, res) => {
  try {
    const {
      title,
      url,
      summary,
      image_url,
      platform,
      category_id,
      submitter_id,
    } = req.body;
    // ✅ basic validation
    // if (!title || !url || !submitter_id) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "title, url, and submitter_id are required",
    //   });
    // }
    if (!title || typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({ message: "Valid title is required" });
    }
    if (!url || !url.startsWith("http")) {
    return res.status(400).json({ message: "Valid URL is required" });
    }
    if (!submitter_id || typeof submitter_id !== "number") {
    return res.status(400).json({ message: "Valid submitter_id is required" });
    }
    const result = await pool.query(
      `
      INSERT INTO sources
      (title, url, summary, image_url, platform, category_id, submitter_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
      `,
      [title, url, summary || null, image_url || null, platform || null, category_id || null, submitter_id]
    );
    res.status(201).json({
      success: true,
      message: "Source submitted and set to pending",
      source: result.rows[0],
    });
  } catch (error) {
    console.error("Error submitting source:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to submit source",
      error: error.message,
    });
  }
});

module.exports = router;