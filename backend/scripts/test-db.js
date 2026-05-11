// ============================================================
// GoalBeat AI — DB Connection Tester
// ============================================================
require("dotenv").config({ path: "../.env" });
const { pool } = require("../config/database");

async function testConnection() {
  console.log("🔍 Testing Database Connection...");
  console.log(`📍 Host: ${process.env.DB_HOST || "localhost"}`);
  console.log(`📍 Port: ${process.env.DB_PORT || 3306}`);
  console.log(`📍 User: ${process.env.DB_USER || "root"}`);
  console.log(`📍 DB:   ${process.env.DB_NAME || "goalbeat_ai"}`);
  console.log(`📍 SSL:  ${process.env.DB_SSL === "true" ? "ENABLED" : "DISABLED"}`);

  try {
    const start = Date.now();
    const [rows] = await pool.query("SELECT 1 + 1 AS result");
    const end = Date.now();
    
    console.log("\n✅ SUCCESS!");
    console.log(`⚡ Response: ${rows[0].result}`);
    console.log(`⏱️ Latency: ${end - start}ms`);
    
    // Check if tables exist
    const [tables] = await pool.query("SHOW TABLES");
    console.log(`📊 Found ${tables.length} tables in schema.`);
    
    process.exit(0);
  } catch (err) {
    console.error("\n❌ CONNECTION FAILED!");
    console.error(`⚠️ Error: ${err.message}`);
    console.error(`💡 Tip: Check your Aiven credentials and firewall settings.`);
    process.exit(1);
  }
}

testConnection();
