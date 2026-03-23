const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


// ✅ PATCH /api/admin/approve/:id
router.patch(
    "/approve/:id", 
    authMiddleware, 
    adminMiddleware, 
    async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      UPDATE sources
      SET status = 'approved'
      WHERE id = $1
      RETURNING *;
      `,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Source not found",
      });
    }
    res.json({
      success: true,
      message: "Source approved successfully",
      source: result.rows[0],
    });
  } catch (error) {
    console.error("Error approving source:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to approve source",
      error: error.message,
    });
  }
});

// ✅ PATCH /api/admin/reject/:id
router.patch(
  "/reject/:id",
  authMiddleware,
  adminMiddleware,
  async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `
        UPDATE sources
        SET status = 'rejected'
        WHERE id = $1
        RETURNING *;
        `,
        [id]
      );
      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Source not found",
        });
      }
      res.json({
        success: true,
        message: "Source rejected successfully",
        source: result.rows[0],
      });
    } catch (error) {
      console.error("Error rejecting source:", error.message);
      res.status(500).json({
        success: false,
        message: "Failed to reject source",
        error: error.message,
      });
    }
  }
);

module.exports = router;