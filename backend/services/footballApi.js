// ============================================================
// GoalBeat AI — API-Football Service (api-sports.io)
// Free tier: 100 requests/day — NO credit card required
// Sign up: https://dashboard.api-football.com/register
// ============================================================
const axios = require("axios");
const NodeCache = require("node-cache");

// In-memory cache to preserve free API quota
const cache = new NodeCache({
  stdTTL: parseInt(process.env.CACHE_TTL_STANDINGS) || 300,
});

const client = axios.create({
  baseURL: process.env.API_FOOTBALL_URL || "https://v3.football.api-sports.io",
  headers: {
    "x-apisports-key": process.env.API_FOOTBALL_KEY || "",
  },
  timeout: 10000,
});

// ── League ID map (API-Football IDs) ────────────────────────
const LEAGUE_IDS = {
  // Global
  "world-cup": 1,
  "champions-league": 2,
  "europa-league": 3,
  "conference-league": 848,
  // Top 10 Domestic
  "premier-league": 39,
  "la-liga": 140,
  bundesliga: 78,
  "serie-a": 135,
  "ligue-1": 61,
  "eredivisie": 88,
  "primeira-liga": 94,
  "super-lig": 203,
  "pro-league": 144, // Belgian
  "scottish-premiership": 179,
  // Other
  mls: 253,
  "brasileirao": 71,
  "argentine-primera": 128,
  "j-league": 98,
  "k-league": 292,
  "saudi-pro-league": 307,
  // Domestic Cups
  "fa-cup": 45,
  "copa-del-rey": 143,
  "dfb-pokal": 81,
  "coppa-italia": 137,
  "coupe-de-france": 66,
  "carabao-cup": 48,
};

const CURRENT_SEASON = new Date().getFullYear();

// ── Helpers ──────────────────────────────────────────────────
async function get(endpoint, params = {}, ttl = null) {
  const cacheKey = `${endpoint}:${JSON.stringify(params)}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  try {
    const res = await client.get(endpoint, { params });
    const data = res.data;
    if (ttl !== null) {
      cache.set(cacheKey, data, ttl);
    } else {
      cache.set(cacheKey, data);
    }
    return data;
  } catch (err) {
    console.error(`API-Football error [${endpoint}]:`, err.message);
    throw err;
  }
}

// ── Exports ──────────────────────────────────────────────────
module.exports = {
  LEAGUE_IDS,
  CURRENT_SEASON,

  async getLeagueInfo(leagueId) {
    return get("/leagues", { id: leagueId }, 3600);
  },

  async getStandings(leagueId, season = CURRENT_SEASON) {
    return get("/standings", { league: leagueId, season }, 300);
  },

  async getFixtures(leagueId, season = CURRENT_SEASON, status = null) {
    const params = { league: leagueId, season };
    if (status) params.status = status;
    return get("/fixtures", params, 60);
  },

  async getFixtureById(fixtureId) {
    return get("/fixtures", { id: fixtureId }, 30);
  },

  async getLiveFixtures() {
    return get("/fixtures", { live: "all" }, 30);
  },

  async getFixtureStats(fixtureId) {
    return get("/fixtures/statistics", { fixture: fixtureId }, 30);
  },

  async getFixtureEvents(fixtureId) {
    return get("/fixtures/events", { fixture: fixtureId }, 30);
  },

  async getFixtureLineups(fixtureId) {
    return get("/fixtures/lineups", { fixture: fixtureId }, 60);
  },

  async getFixturePredictions(fixtureId) {
    return get("/predictions", { fixture: fixtureId }, 300);
  },

  async getTopScorers(leagueId, season = CURRENT_SEASON) {
    return get("/players/topscorers", { league: leagueId, season }, 600);
  },

  async getTopAssists(leagueId, season = CURRENT_SEASON) {
    return get("/players/topassists", { league: leagueId, season }, 600);
  },

  async getTeamInfo(teamId) {
    return get("/teams", { id: teamId }, 3600);
  },

  async getTeamStats(teamId, leagueId, season = CURRENT_SEASON) {
    return get("/teams/statistics", { team: teamId, league: leagueId, season }, 600);
  },

  async getTeamFixtures(teamId, last = 5) {
    return get("/fixtures", { team: teamId, last }, 300);
  },

  async getTeamPlayers(teamId, season = CURRENT_SEASON) {
    return get("/players", { team: teamId, season }, 600);
  },

  async searchTeams(query) {
    return get("/teams", { search: query }, 300);
  },

  async searchLeagues(query) {
    return get("/leagues", { search: query }, 3600);
  },

  async getLeaguesByCountry(country) {
    return get("/leagues", { country }, 3600);
  },

  async getCountries() {
    return get("/countries", {}, 86400);
  },

  async getNextFixtures(leagueId, season = CURRENT_SEASON, next = 10) {
    return get("/fixtures", { league: leagueId, season, next }, 300);
  },

  async getLastFixtures(leagueId, season = CURRENT_SEASON, last = 10) {
    return get("/fixtures", { league: leagueId, season, last }, 300);
  },
};
