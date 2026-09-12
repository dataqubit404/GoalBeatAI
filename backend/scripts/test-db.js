// ============================================================
// GoalBeat AI — DB Connection Tester
// ============================================================
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });
require("dotenv").config();

const { pool } = require("../config/database");

async function testConnection() {
  console.log("\n🔍 Testing Database Connection...");
  if (process.env.DATABASE_URL || process.env.MYSQL_URL) {
    console.log(`📍 Connection Mode: DATABASE_URL / Service URI`);
  } else {
    console.log(`📍 Host: ${process.env.DB_HOST || "localhost"}`);
    console.log(`📍 Port: ${process.env.DB_PORT || 3306}`);
    console.log(`📍 User: ${process.env.DB_USER || "root"}`);
    console.log(`📍 DB:   ${process.env.DB_NAME || "defaultdb"}`);
  }
  console.log(`📍 SSL:  ${(process.env.NODE_ENV === "production" || process.env.DB_SSL === "true" || process.env.DATABASE_URL?.includes("ssl")) ? "ENABLED" : "DISABLED"}`);

  try {
    const start = Date.now();
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    const end = Date.now();
    
    console.log("\n✅ SUCCESS!");
    console.log(`⚡ Query Result: ${rows[0].result}`);
    console.log(`⏱️ Latency: ${end - start}ms`);
    
    // Check if tables exist
    const [tables] = await pool.query("SHOW TABLES");
    console.log(`📊 Found ${tables.length} tables in schema.`);
    
    process.exit(0);
  } catch (err) {
    console.error("\n❌ CONNECTION FAILED!");
    console.error(`⚠️ Error: ${err.message}`);
    console.error(`💡 Tip: Check your Aiven credentials, SSL setting, and firewall rules.`);
    process.exit(1);
  }
}

testConnection();
