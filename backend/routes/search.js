// GoalBeat AI — Search Route
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/search?q=manchester&type=team|league|all
router.get("/", async (req, res) => {
  try {
    const { q, type = "all" } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(400).json({ error: "Query must be at least 2 characters" });
    }

    const results = {};

    if (type === "all" || type === "league") {
      try {
        const leagues = await api.searchLeagues(q);
        results.leagues = leagues?.response?.slice(0, 10) || [];
      } catch (e) {
        results.leagues = [];
      }
    }

    if (type === "all" || type === "team") {
      try {
        const teams = await api.searchTeams(q);
        results.teams = teams?.response?.slice(0, 10) || [];
      } catch (e) {
        results.teams = [];
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
