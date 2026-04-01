const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../config/db");
const jwt = require("jsonwebtoken");

const router = express.Router();

// ✅ POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    // ✅ basic validation
    if (!username || typeof username !== "string" || username.trim() === "") {
      return res.status(400).json({ message: "Valid username is required" });
    }
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!password || typeof password !== "string" || password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }
    // ✅ optional: restrict allowed roles
    const safeRole = role === "admin" ? "admin" : "user";
    // ✅ check if username already exists
    const existingUsername = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (existingUsername.rows.length > 0) {
      return res.status(409).json({ message: "Username already exists" });
    }
    // ✅ check if email already exists
    const existingEmail = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existingEmail.rows.length > 0) {
      return res.status(409).json({ message: "Email already exists" });
    }
    // ✅ hash password before saving
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    // ✅ insert new user
    const result = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, role)
      VALUES ($1, $2, $3, $4)
      RETURNING id, username, email, role, created_at;
      `,
      [username.trim(), email.trim().toLowerCase(), password_hash, safeRole]
    );
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Signup error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
      error: error.message,
    });
  }
});


// ✅ POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    // ✅ validate input
    if (!email || typeof email !== "string" || !email.includes("@")) {
      return res.status(400).json({ message: "Valid email is required" });
    }
    if (!password || typeof password !== "string") {
      return res.status(400).json({ message: "Password is required" });
    }
    // ✅ find user by email
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email.trim().toLowerCase()]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const user = result.rows[0];
    // ✅ compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    // ✅ login success
    // ✅ create token
    const token = jwt.sign(
    {
        id: user.id,
        role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
    );
    // ✅ send token
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
});

module.exports = router;