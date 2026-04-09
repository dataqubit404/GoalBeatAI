// GoalBeat AI — Standings Route
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/standings/:leagueId
router.get("/:leagueId", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getStandings(req.params.leagueId, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
