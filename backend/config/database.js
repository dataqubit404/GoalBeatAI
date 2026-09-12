// ============================================================
// GoalBeat AI — PostgreSQL Database Config
// Local: PostgreSQL | Production: Render PostgreSQL / Supabase / Neon / Aiven
// ============================================================
const { Pool } = require("pg");

const isProduction = process.env.NODE_ENV === "production";

let poolConfig;

if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
  poolConfig = {
    connectionString: process.env.DATABASE_URL || process.env.POSTGRES_URL,
  };
} else {
  poolConfig = {
    host: process.env.DB_HOST || process.env.PGHOST || "localhost",
    port: parseInt(process.env.DB_PORT || process.env.PGPORT) || 5432,
    user: process.env.DB_USER || process.env.PGUSER || "postgres",
    password: process.env.DB_PASSWORD || process.env.PGPASSWORD || "",
    database: process.env.DB_NAME || process.env.PGDATABASE || "goalbeat_ai",
  };
}

// Enable SSL for cloud PostgreSQL (Render, Neon, Supabase, Aiven)
// When connecting via Render internal network (host contains .internal or dpg-xxx), SSL is not needed
const isInternalRender = process.env.DATABASE_URL?.includes(".internal");
const needsSSL =
  process.env.DB_SSL === "true" ||
  (isProduction && !isInternalRender) ||
  process.env.DATABASE_URL?.includes("sslmode=require");

if (needsSSL) {
  poolConfig.ssl = {
    rejectUnauthorized: process.env.DB_SSL_STRICT === "true",
  };
}

const pool = new Pool(poolConfig);

// ── Initialize PostgreSQL DB Schema ────────────────────────
async function initializeDatabase() {
  let client;
  try {
    client = await pool.connect();

    // Users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Favorite leagues
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorite_leagues (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        league_id INT NOT NULL,
        league_name VARCHAR(100),
        league_logo VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Favorite clubs
    await client.query(`
      CREATE TABLE IF NOT EXISTS favorite_clubs (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        team_id INT NOT NULL,
        team_name VARCHAR(100),
        team_logo VARCHAR(255),
        added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Match notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) ON DELETE CASCADE,
        fixture_id INT NOT NULL,
        type VARCHAR(20) DEFAULT 'kickoff' CHECK (type IN ('kickoff','goal','result','prediction')),
        message TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Cached predictions (avoid re-computing)
    await client.query(`
      CREATE TABLE IF NOT EXISTS predictions_cache (
        fixture_id INT PRIMARY KEY,
        prediction_data JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log("✅ PostgreSQL Database initialized");
  } catch (err) {
    console.error("❌ Database init error:", err.message);
    // Non-fatal — app still works without DB (uses API cache)
  } finally {
    if (client) client.release();
  }
}

module.exports = { pool, initializeDatabase };
