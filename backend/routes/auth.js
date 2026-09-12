// ============================================================
// GoalBeat AI — Auth Routes (PostgreSQL)
// ============================================================
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/database");

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 */
router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  try {
    // Check if user exists
    const { rows: existing } = await pool.query(
      "SELECT id FROM users WHERE email = $1 OR username = $2",
      [email, username]
    );
    if (existing.length > 0) {
      return res.status(400).json({ error: "User with this email or username already exists" });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Create user
    const { rows: insertRows } = await pool.query(
      "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email",
      [username, email, password_hash]
    );

    const newUser = insertRows[0];
    const userId = newUser.id;

    // Generate token
    const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      token,
      user: {
        id: userId,
        username: newUser.username,
        email: newUser.email
      }
    });

  } catch (err) {
    console.error("Register Error:", err.message);
    res.status(500).json({ error: "Server error during registration" });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please enter all fields" });
  }

  try {
    // Check user
    const { rows: users } = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (users.length === 0) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const user = users[0];

    // Check password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ error: "Server error during login" });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get user data
 */
router.get("/me", async (req, res) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { rows: users } = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [decoded.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(users[0]);
  } catch (err) {
    res.status(401).json({ error: "Token is not valid" });
  }
});

module.exports = router;
