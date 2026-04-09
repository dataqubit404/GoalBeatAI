// ============================================================
// GoalBeat AI — MySQL Database Config
// Local: mysql2 | Production: Aiven MySQL (same config, SSL)
// ============================================================
const mysql = require("mysql2/promise");

const isProduction = process.env.NODE_ENV === "production";

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "goalbeat_ai",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

// Enable SSL for Aiven production
if (isProduction && process.env.DB_SSL === "true") {
  poolConfig.ssl = { rejectUnauthorized: false };
}

const pool = mysql.createPool(poolConfig);

// ── Initialize DB Schema ────────────────────────────────────
async function initializeDatabase() {
  const conn = await pool.getConnection();
  try {
    await conn.query(`CREATE DATABASE IF NOT EXISTS goalbeat_ai`);
    await conn.query(`USE goalbeat_ai`);

    // Users table
    await conn.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Favorite leagues
    await conn.query(`
      CREATE TABLE IF NOT EXISTS favorite_leagues (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        league_id INT NOT NULL,
        league_name VARCHAR(100),
        league_logo VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Favorite clubs
    await conn.query(`
      CREATE TABLE IF NOT EXISTS favorite_clubs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        team_id INT NOT NULL,
        team_name VARCHAR(100),
        team_logo VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Match notifications
    await conn.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        fixture_id INT NOT NULL,
        type ENUM('kickoff','goal','result','prediction') DEFAULT 'kickoff',
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Cached predictions (avoid re-computing)
    await conn.query(`
      CREATE TABLE IF NOT EXISTS predictions_cache (
        fixture_id INT PRIMARY KEY,
        prediction_data JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    console.log("✅ Database initialized");
  } catch (err) {
    console.error("❌ Database init error:", err.message);
    // Non-fatal — app still works without DB (uses API cache)
  } finally {
    conn.release();
  }
}

module.exports = { pool, initializeDatabase };
