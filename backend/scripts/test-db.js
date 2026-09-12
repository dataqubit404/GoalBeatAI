// ============================================================
// GoalBeat AI — PostgreSQL DB Connection Tester
// ============================================================
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();

const { pool } = require("../config/database");

async function testConnection() {
  console.log("\n🔍 Testing PostgreSQL Database Connection...");
  if (process.env.DATABASE_URL || process.env.POSTGRES_URL) {
    console.log(`📍 Connection Mode: DATABASE_URL / Connection String`);
  } else {
    console.log(`📍 Host: ${process.env.DB_HOST || process.env.PGHOST || "localhost"}`);
    console.log(`📍 Port: ${process.env.DB_PORT || process.env.PGPORT || 5432}`);
    console.log(`📍 User: ${process.env.DB_USER || process.env.PGUSER || "postgres"}`);
    console.log(`📍 DB:   ${process.env.DB_NAME || process.env.PGDATABASE || "goalbeat_ai"}`);
  }

  try {
    const start = Date.now();
    const { rows } = await pool.query("SELECT 1 + 1 AS result");
    const end = Date.now();
    
    console.log("\n✅ SUCCESS!");
    console.log(`⚡ Query Result: ${rows[0].result}`);
    console.log(`⏱️ Latency: ${end - start}ms`);
    
    // Check if tables exist in public schema
    const { rows: tables } = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'"
    );
    console.log(`📊 Found ${tables.length} tables in schema.`);
    if (tables.length > 0) {
      console.log(`   Tables: ${tables.map(t => t.table_name).join(", ")}`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error("\n❌ CONNECTION FAILED!");
    console.error(`⚠️ Error: ${err.message}`);
    console.error(`💡 Tip: Verify your PostgreSQL DATABASE_URL or connection parameters.`);
    process.exit(1);
  }
}

testConnection();
