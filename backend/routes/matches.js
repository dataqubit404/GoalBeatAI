// GoalBeat AI — Matches Route
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/matches/live
router.get("/live", async (req, res) => {
  try {
    const data = await api.getLiveFixtures();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id — Single fixture details
router.get("/:id", async (req, res) => {
  try {
    const data = await api.getFixtureById(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/stats
router.get("/:id/stats", async (req, res) => {
  try {
    const data = await api.getFixtureStats(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/events
router.get("/:id/events", async (req, res) => {
  try {
    const data = await api.getFixtureEvents(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/matches/:id/lineups
router.get("/:id/lineups", async (req, res) => {
  try {
    const data = await api.getFixtureLineups(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
