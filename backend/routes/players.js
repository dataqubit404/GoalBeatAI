// GoalBeat AI — Players Route
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/players/topscorers/:leagueId
router.get("/topscorers/:leagueId", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getTopScorers(req.params.leagueId, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/players/topassists/:leagueId
router.get("/topassists/:leagueId", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getTopAssists(req.params.leagueId, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
