// GoalBeat AI — Prediction Route
const express = require("express");
const router = express.Router();
const { predictMatch } = require("../services/predictionService");

// GET /api/predict/:fixtureId
router.get("/:fixtureId", async (req, res) => {
  try {
    const prediction = await predictMatch(req.params.fixtureId);
    res.json(prediction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
