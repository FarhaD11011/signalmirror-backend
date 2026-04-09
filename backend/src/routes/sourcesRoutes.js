const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const optionalAuthMiddleware = require("../middleware/optionalAuthMiddleware");


// ✅ GET /api/sources
// public feed: only approved sources, optionally filtered by category, with pagination
router.get("/", optionalAuthMiddleware, async (req, res) => {
  try {
    const { category_id, page = 1, limit = 5 } = req.query;
    const userId = req.user?.id || null;

    const parsedPage = Number(page);
    const parsedLimit = Number(limit);

    if (!Number.isInteger(parsedPage) || parsedPage <= 0) {
      return res.status(400).json({
        success: false,
        message: "page must be a positive integer",
      });
    }

    if (!Number.isInteger(parsedLimit) || parsedLimit <= 0) {
      return res.status(400).json({
        success: false,
        message: "limit must be a positive integer",
      });
    }

    const offset = (parsedPage - 1) * parsedLimit;

    let whereClause = `WHERE sources.status = 'approved'`;

    const countValues = [];
    const dataValues = [userId];

    if (category_id !== undefined && category_id !== "") {
      const parsedCategoryId = Number(category_id);

      if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
        return res.status(400).json({
          success: false,
          message: "category_id must be a positive integer",
        });
      }

      // ✅ count query placeholder starts at $1
      countValues.push(parsedCategoryId);

      // ✅ data query already uses $1 for userId, so category becomes $2
      dataValues.push(parsedCategoryId);

      whereClause += ` AND sources.category_id = ${
        countValues.length > 0 ? "$1" : ""
      }`;
    }

    // ✅ total count query
    const countQuery = `
      SELECT COUNT(*) AS total
      FROM sources
      ${whereClause}
    `;

    const countResult = await pool.query(countQuery, countValues);
    const totalSources = Number(countResult.rows[0].total);
    const totalPages = Math.ceil(totalSources / parsedLimit);

    // ✅ main data query placeholders
    let dataWhereClause = `WHERE sources.status = 'approved'`;
    if (category_id !== undefined && category_id !== "") {
      dataWhereClause += ` AND sources.category_id = $2`;
    }

    dataValues.push(parsedLimit);
    dataValues.push(offset);

    const query = `
      SELECT
        sources.*,
        COALESCE(SUM(CASE WHEN votes.vote_type = 'up' THEN 1 ELSE 0 END), 0) AS upvotes,
        COALESCE(SUM(CASE WHEN votes.vote_type = 'down' THEN 1 ELSE 0 END), 0) AS downvotes,
        COALESCE(SUM(
          CASE
            WHEN votes.vote_type = 'up' THEN 1
            WHEN votes.vote_type = 'down' THEN -1
            ELSE 0
          END
        ), 0) AS score,
        MAX(
          CASE
            WHEN votes.user_id = $1 THEN votes.vote_type
            ELSE NULL
          END
        ) AS user_vote
      FROM sources
      LEFT JOIN votes ON sources.id = votes.source_id
      ${dataWhereClause}
      GROUP BY sources.id
      ORDER BY sources.created_at DESC
      LIMIT $${dataValues.length - 1}
      OFFSET $${dataValues.length}
    `;

    const result = await pool.query(query, dataValues);

    const formattedSources = result.rows.map((source) => ({
      ...source,
      upvotes: Number(source.upvotes),
      downvotes: Number(source.downvotes),
      score: Number(source.score),
      user_vote: source.user_vote || null,
    }));

    res.json({
      success: true,
      count: formattedSources.length,
      totalSources,
      totalPages,
      currentPage: parsedPage,
      limit: parsedLimit,
      sources: formattedSources,
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
      video_url,
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
    // ✅ normalize URL a little
    const cleanUrl = url.trim();

    // ✅ check for duplicate URL before insert
    const existingSource = await pool.query(
      `
      SELECT id, title, status
      FROM sources
      WHERE url = $1
      LIMIT 1;
      `,
      [cleanUrl]
    );
    if (existingSource.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This source has already been submitted.",
        existingSource: existingSource.rows[0],
      });
    }

    // ✅ insert only if URL does not already exist
    const result = await pool.query(
      `
      INSERT INTO sources
      (title, url, summary, image_url, video_url, platform, category_id, submitter_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *;
      `,
      [title, url, summary || null, image_url || null, video_url || null, platform || null, category_id || null, submitter_id]
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