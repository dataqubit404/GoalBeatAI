// ============================================================
// GoalBeat AI — Express Server
// ============================================================
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const { createServer } = require("http");
const { Server } = require("socket.io");

const { pool, initializeDatabase } = require("./config/database");

const app = express();
const httpServer = createServer(app);

// Initialize Database
initializeDatabase();

// Socket.IO for live scores
const io = new Server(httpServer, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// ── Middleware ──────────────────────────────────────────────
app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL || "http://localhost:5173" }));
app.use(express.json());
app.use(morgan("dev"));

// Rate limiting — protect free API quota
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  message: { error: "Too many requests, slow down." },
});
app.use("/api/", apiLimiter);

// ── Routes ──────────────────────────────────────────────────
app.use("/api/leagues",    require("./routes/leagues"));
app.use("/api/standings",  require("./routes/standings"));
app.use("/api/matches",    require("./routes/matches"));
app.use("/api/clubs",      require("./routes/clubs"));
app.use("/api/players",    require("./routes/players"));
app.use("/api/predict",    require("./routes/predict"));
app.use("/api/compare",    require("./routes/compare"));
app.use("/api/search",     require("./routes/search"));
app.use("/api/auth",       require("./routes/auth"));

// Health check
app.get("/health", (req, res) => res.json({ status: "ok", time: new Date() }));

// ── Socket.IO Live Scores ───────────────────────────────────
const liveService = require("./services/liveService");

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  socket.on("subscribe:league", (leagueId) => {
    socket.join(`league:${leagueId}`);
    console.log(`${socket.id} subscribed to league ${leagueId}`);
  });

  socket.on("subscribe:match", (matchId) => {
    socket.join(`match:${matchId}`);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// Broadcast live score updates every 60s
setInterval(async () => {
  try {
    const live = await liveService.getLiveMatches();
    if (live && live.length > 0) {
      io.emit("live:scores", live);
    }
  } catch (e) {
    // Silently fail — preserve API quota
  }
}, 60000);

// ── Start ───────────────────────────────────────────────────
const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`\n⚽ GoalBeat AI Backend running on port ${PORT}`);
  console.log(`   Mode: ${process.env.NODE_ENV || "development"}`);
  console.log(`   Health: http://localhost:${PORT}/health\n`);
});

module.exports = { app, io };
