// GoalBeat AI — Clubs Route
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/clubs/:id
router.get("/:id", async (req, res) => {
  try {
    const data = await api.getTeamInfo(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clubs/:id/stats?league=39
router.get("/:id/stats", async (req, res) => {
  try {
    const { league, season } = req.query;
    if (!league) return res.status(400).json({ error: "league query param required" });
    const data = await api.getTeamStats(req.params.id, league, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clubs/:id/fixtures?last=5
router.get("/:id/fixtures", async (req, res) => {
  try {
    const last = req.query.last || 5;
    const data = await api.getTeamFixtures(req.params.id, last);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/clubs/:id/players?season=2024
router.get("/:id/players", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getTeamPlayers(req.params.id, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
