// GoalBeat AI — League Comparison Route (up to 3 leagues)
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/compare?leagues=39,140,78&season=2024
router.get("/", async (req, res) => {
  try {
    const { leagues, season } = req.query;
    if (!leagues) return res.status(400).json({ error: "leagues query param required (comma-separated, max 3)" });

    const ids = leagues.split(",").slice(0, 3).map(Number);
    const s = season || api.CURRENT_SEASON;

    const results = await Promise.allSettled(
      ids.map(async (id) => {
        const [infoRes, standingsRes, scorersRes] = await Promise.all([
          api.getLeagueInfo(id),
          api.getStandings(id, s),
          api.getTopScorers(id, s),
        ]);
        return {
          league: infoRes?.response?.[0]?.league || null,
          country: infoRes?.response?.[0]?.country || null,
          standings: standingsRes?.response?.[0]?.league?.standings?.[0] || [],
          topScorers: scorersRes?.response?.slice(0, 5) || [],
        };
      })
    );

    const data = results
      .filter((r) => r.status === "fulfilled")
      .map((r) => r.value);

    res.json({ data, season: s });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
