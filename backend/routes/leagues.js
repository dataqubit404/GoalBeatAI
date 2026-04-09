// GoalBeat AI — Leagues Route
const express = require("express");
const router = express.Router();
const api = require("../services/footballApi");

// GET /api/leagues — All supported leagues
router.get("/", async (req, res) => {
  try {
    const { country, type } = req.query;
    let data;

    if (country) {
      data = await api.getLeaguesByCountry(country);
    } else {
      // Return our curated list with metadata
      const leagueList = Object.entries(api.LEAGUE_IDS).map(([slug, id]) => ({
        slug,
        id,
      }));
      return res.json({ response: leagueList, source: "curated" });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leagues/:id — Single league info
router.get("/:id", async (req, res) => {
  try {
    const data = await api.getLeagueInfo(req.params.id);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leagues/:id/standings
router.get("/:id/standings", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getStandings(req.params.id, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leagues/:id/scorers
router.get("/:id/scorers", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getTopScorers(req.params.id, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leagues/:id/assists
router.get("/:id/assists", async (req, res) => {
  try {
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getTopAssists(req.params.id, season);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leagues/:id/fixtures/next
router.get("/:id/fixtures/next", async (req, res) => {
  try {
    const next = req.query.next || 10;
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getNextFixtures(req.params.id, season, next);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/leagues/:id/fixtures/last
router.get("/:id/fixtures/last", async (req, res) => {
  try {
    const last = req.query.last || 10;
    const season = req.query.season || api.CURRENT_SEASON;
    const data = await api.getLastFixtures(req.params.id, season, last);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
