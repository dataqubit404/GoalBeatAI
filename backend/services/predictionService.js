// ============================================================
// GoalBeat AI — Match Prediction Service
// Algorithm: Last 5 matches performance + H2H + home advantage
// ============================================================
const api = require("./footballApi");

function safeNum(val, fallback = 0) {
  const n = parseFloat(val);
  return isNaN(n) ? fallback : n;
}

// Extract form score from last N fixtures
function calcFormScore(fixtures, teamId) {
  if (!fixtures || fixtures.length === 0) return 1.0;

  let score = 0;
  let count = 0;

  fixtures.slice(0, 5).forEach((f) => {
    const home = f.teams?.home;
    const away = f.teams?.away;
    const isHome = home?.id === teamId;
    const isAway = away?.id === teamId;
    if (!isHome && !isAway) return;

    const winner = home?.winner ? "home" : away?.winner ? "away" : "draw";
    const isWin = (isHome && winner === "home") || (isAway && winner === "away");
    const isDraw = winner === "draw";

    score += isWin ? 3 : isDraw ? 1 : 0;
    count++;
  });

  return count > 0 ? score / (count * 3) : 0.5; // normalized 0-1
}

// Extract xG from stats
function extractXg(stats) {
  if (!stats || !Array.isArray(stats)) return null;
  const xgStat = stats.find((s) => s.type === "expected_goals" || s.type === "xG");
  return xgStat ? safeNum(xgStat.value) : null;
}

async function predictMatch(fixtureId) {
  try {
    // 1. Get fixture info
    const fixtureRes = await api.getFixtureById(fixtureId);
    const fixture = fixtureRes?.response?.[0];
    if (!fixture) throw new Error("Fixture not found");

    const homeTeam = fixture.teams?.home;
    const awayTeam = fixture.teams?.away;
    const leagueId = fixture.league?.id;

    // 2. Get API predictions (if available in quota)
    let apiPrediction = null;
    try {
      const predRes = await api.getFixturePredictions(fixtureId);
      apiPrediction = predRes?.response?.[0];
    } catch (e) {
      // Quota exceeded - use our own algorithm
    }

    // 3. Get last 5 matches for both teams
    const [homeFixturesRes, awayFixturesRes] = await Promise.all([
      api.getTeamFixtures(homeTeam.id, 5),
      api.getTeamFixtures(awayTeam.id, 5),
    ]);

    const homeFixtures = homeFixturesRes?.response || [];
    const awayFixtures = awayFixturesRes?.response || [];

    // 4. Calculate form scores
    const homeForm = calcFormScore(homeFixtures, homeTeam.id);
    const awayForm = calcFormScore(awayFixtures, awayTeam.id);

    // 5. Get team stats
    let homeStats = null;
    let awayStats = null;
    try {
      const [hs, as_] = await Promise.all([
        api.getTeamStats(homeTeam.id, leagueId),
        api.getTeamStats(awayTeam.id, leagueId),
      ]);
      homeStats = hs?.response;
      awayStats = as_?.response;
    } catch (e) {}

    // 6. Build scoring factors
    const HOME_ADVANTAGE = 0.08;

    // Goals scored avg
    const homeGoalsFor = safeNum(homeStats?.goals?.for?.average?.total, 1.3);
    const awayGoalsFor = safeNum(awayStats?.goals?.for?.average?.total, 1.1);
    const homeGoalsAgainst = safeNum(homeStats?.goals?.against?.average?.total, 1.2);
    const awayGoalsAgainst = safeNum(awayStats?.goals?.against?.average?.total, 1.4);

    // Predicted goals (attack vs defense)
    const homeExpectedGoals = (homeGoalsFor + awayGoalsAgainst) / 2;
    const awayExpectedGoals = (awayGoalsFor + homeGoalsAgainst) / 2;

    // Win probability using Poisson approximation
    function poissonProb(lambda, k) {
      return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    }
    function factorial(n) {
      if (n <= 1) return 1;
      return n * factorial(n - 1);
    }

    let homeWinP = 0, drawP = 0, awayWinP = 0;
    for (let i = 0; i <= 6; i++) {
      for (let j = 0; j <= 6; j++) {
        const p = poissonProb(homeExpectedGoals, i) * poissonProb(awayExpectedGoals, j);
        if (i > j) homeWinP += p;
        else if (i === j) drawP += p;
        else awayWinP += p;
      }
    }

    // Apply form multiplier and home advantage
    homeWinP = homeWinP * (1 + homeForm * 0.3 + HOME_ADVANTAGE);
    awayWinP = awayWinP * (1 + awayForm * 0.3);

    // Normalize
    const total = homeWinP + drawP + awayWinP;
    homeWinP = Math.round((homeWinP / total) * 100);
    awayWinP = Math.round((awayWinP / total) * 100);
    drawP = 100 - homeWinP - awayWinP;

    // 7. Build last 5 form strings
    function buildFormString(fixtures, teamId) {
      return fixtures.slice(0, 5).map((f) => {
        const home = f.teams?.home;
        const away = f.teams?.away;
        const isHome = home?.id === teamId;
        const winner = home?.winner ? "home" : away?.winner ? "away" : "draw";
        const isWin = (isHome && winner === "home") || (!isHome && winner === "away");
        const isDraw = winner === "draw";
        return isWin ? "W" : isDraw ? "D" : "L";
      });
    }

    return {
      fixture: {
        id: fixtureId,
        date: fixture.fixture?.date,
        venue: fixture.fixture?.venue?.name,
        league: { name: fixture.league?.name, logo: fixture.league?.logo },
      },
      homeTeam: {
        id: homeTeam.id,
        name: homeTeam.name,
        logo: homeTeam.logo,
        form: buildFormString(homeFixtures, homeTeam.id),
        avgGoalsScored: homeGoalsFor.toFixed(2),
        avgGoalsConceded: homeGoalsAgainst.toFixed(2),
      },
      awayTeam: {
        id: awayTeam.id,
        name: awayTeam.name,
        logo: awayTeam.logo,
        form: buildFormString(awayFixtures, awayTeam.id),
        avgGoalsScored: awayGoalsFor.toFixed(2),
        avgGoalsConceded: awayGoalsAgainst.toFixed(2),
      },
      prediction: {
        homeWin: homeWinP,
        draw: drawP,
        awayWin: awayWinP,
        expectedGoals: {
          home: homeExpectedGoals.toFixed(2),
          away: awayExpectedGoals.toFixed(2),
        },
        suggestion:
          homeWinP >= awayWinP && homeWinP >= drawP
            ? homeTeam.name
            : awayWinP >= homeWinP && awayWinP >= drawP
            ? awayTeam.name
            : "Draw likely",
        confidence:
          Math.max(homeWinP, drawP, awayWinP) > 55 ? "High" : Math.max(homeWinP, drawP, awayWinP) > 40 ? "Medium" : "Low",
        apiPrediction: apiPrediction?.predictions || null,
      },
    };
  } catch (err) {
    console.error("Prediction error:", err.message);
    throw err;
  }
}

module.exports = { predictMatch };
