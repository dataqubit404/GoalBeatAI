// GoalBeat AI — High-Quality Mock Data for Demo Mode

const T = (id, name) => ({ id, name, logo: `https://media.api-sports.io/football/teams/${id}.png` });

// ── Standings by League ──────────────────────────────────────
export const MOCK_STANDINGS = {
  39: [ // Premier League 2023-24
    { rank: 1,  team: T(50,  "Manchester City"),  points: 91, played: 38, win: 28, draw: 7,  loss: 3,  goalsFor: 96, goalsAgainst: 45, goalsDiff: 51 },
    { rank: 2,  team: T(42,  "Arsenal"),          points: 89, played: 38, win: 28, draw: 5,  loss: 5,  goalsFor: 91, goalsAgainst: 29, goalsDiff: 62 },
    { rank: 3,  team: T(40,  "Liverpool"),        points: 82, played: 38, win: 24, draw: 10, loss: 4,  goalsFor: 86, goalsAgainst: 41, goalsDiff: 45 },
    { rank: 4,  team: T(66,  "Aston Villa"),      points: 68, played: 38, win: 20, draw: 8,  loss: 10, goalsFor: 76, goalsAgainst: 61, goalsDiff: 15 },
    { rank: 5,  team: T(67,  "Tottenham"),        points: 66, played: 38, win: 20, draw: 6,  loss: 12, goalsFor: 74, goalsAgainst: 61, goalsDiff: 13 },
    { rank: 6,  team: T(47,  "Chelsea"),          points: 63, played: 38, win: 18, draw: 9,  loss: 11, goalsFor: 77, goalsAgainst: 63, goalsDiff: 14 },
    { rank: 7,  team: T(34,  "Newcastle"),        points: 60, played: 38, win: 18, draw: 6,  loss: 14, goalsFor: 85, goalsAgainst: 62, goalsDiff: 23 },
    { rank: 8,  team: T(33,  "Man United"),       points: 60, played: 38, win: 18, draw: 6,  loss: 14, goalsFor: 57, goalsAgainst: 58, goalsDiff: -1 },
    { rank: 9,  team: T(49,  "Chelsea B"),        points: 54, played: 38, win: 15, draw: 9,  loss: 14, goalsFor: 61, goalsAgainst: 60, goalsDiff: 1  },
    { rank: 10, team: T(55,  "Brentford"),        points: 51, played: 38, win: 14, draw: 9,  loss: 15, goalsFor: 56, goalsAgainst: 65, goalsDiff: -9 },
    { rank: 11, team: T(35,  "Bournemouth"),      points: 48, played: 38, win: 13, draw: 9,  loss: 16, goalsFor: 54, goalsAgainst: 67, goalsDiff: -13},
    { rank: 12, team: T(73,  "Brighton"),         points: 48, played: 38, win: 12, draw: 12, loss: 14, goalsFor: 55, goalsAgainst: 62, goalsDiff: -7 },
    { rank: 13, team: T(39,  "Wolves"),           points: 46, played: 38, win: 13, draw: 7,  loss: 18, goalsFor: 50, goalsAgainst: 74, goalsDiff: -24},
    { rank: 14, team: T(46,  "West Ham"),         points: 43, played: 38, win: 12, draw: 7,  loss: 19, goalsFor: 60, goalsAgainst: 74, goalsDiff: -14},
    { rank: 15, team: T(45,  "Everton"),          points: 40, played: 38, win: 13, draw: 10, loss: 15, goalsFor: 40, goalsAgainst: 51, goalsDiff: -11},
    { rank: 16, team: T(52,  "Crystal Palace"),   points: 39, played: 38, win: 10, draw: 9,  loss: 19, goalsFor: 57, goalsAgainst: 58, goalsDiff: -1 },
    { rank: 17, team: T(715, "Fulham"),            points: 37, played: 38, win: 10, draw: 7,  loss: 21, goalsFor: 55, goalsAgainst: 76, goalsDiff: -21},
    { rank: 18, team: T(57,  "Nott'm Forest"),    points: 32, played: 38, win: 9,  draw: 5,  loss: 24, goalsFor: 49, goalsAgainst: 67, goalsDiff: -18},
    { rank: 19, team: T(48,  "Luton"),            points: 26, played: 38, win: 6,  draw: 8,  loss: 24, goalsFor: 52, goalsAgainst: 85, goalsDiff: -33},
    { rank: 20, team: T(44,  "Sheffield Utd"),    points: 16, played: 38, win: 3,  draw: 7,  loss: 28, goalsFor: 35, goalsAgainst: 104, goalsDiff:-69},
  ],
  140: [ // La Liga 2023-24
    { rank: 1,  team: T(541, "Real Madrid"),      points: 95, played: 38, win: 29, draw: 8,  loss: 1,  goalsFor: 87, goalsAgainst: 26, goalsDiff: 61 },
    { rank: 2,  team: T(530, "Girona"),           points: 81, played: 38, win: 25, draw: 6,  loss: 7,  goalsFor: 85, goalsAgainst: 46, goalsDiff: 39 },
    { rank: 3,  team: T(529, "Barcelona"),        points: 73, played: 38, win: 22, draw: 7,  loss: 9,  goalsFor: 79, goalsAgainst: 44, goalsDiff: 35 },
    { rank: 4,  team: T(530, "Atlético Madrid"),  points: 76, played: 38, win: 24, draw: 4,  loss: 10, goalsFor: 70, goalsAgainst: 43, goalsDiff: 27 },
    { rank: 5,  team: T(533, "Athletic Club"),    points: 68, played: 38, win: 21, draw: 5,  loss: 12, goalsFor: 61, goalsAgainst: 40, goalsDiff: 21 },
    { rank: 6,  team: T(532, "Real Sociedad"),    points: 60, played: 38, win: 18, draw: 6,  loss: 14, goalsFor: 51, goalsAgainst: 45, goalsDiff: 6  },
    { rank: 7,  team: T(536, "Sevilla"),          points: 54, played: 38, win: 15, draw: 9,  loss: 14, goalsFor: 44, goalsAgainst: 45, goalsDiff: -1 },
    { rank: 8,  team: T(531, "Betis"),            points: 53, played: 38, win: 15, draw: 8,  loss: 15, goalsFor: 56, goalsAgainst: 55, goalsDiff: 1  },
    { rank: 9,  team: T(538, "Getafe"),           points: 46, played: 38, win: 12, draw: 10, loss: 16, goalsFor: 34, goalsAgainst: 45, goalsDiff: -11},
    { rank: 10, team: T(540, "Villarreal"),       points: 45, played: 38, win: 13, draw: 6,  loss: 19, goalsFor: 55, goalsAgainst: 66, goalsDiff: -11},
    { rank: 11, team: T(543, "Real Valladolid"),  points: 42, played: 38, win: 11, draw: 9,  loss: 18, goalsFor: 39, goalsAgainst: 58, goalsDiff: -19},
    { rank: 12, team: T(546, "Rayo Vallecano"),   points: 41, played: 38, win: 11, draw: 8,  loss: 19, goalsFor: 36, goalsAgainst: 55, goalsDiff: -19},
    { rank: 13, team: T(537, "Valencia"),         points: 37, played: 38, win: 9,  draw: 10, loss: 19, goalsFor: 35, goalsAgainst: 59, goalsDiff: -24},
    { rank: 14, team: T(548, "Osasuna"),          points: 37, played: 38, win: 9,  draw: 10, loss: 19, goalsFor: 37, goalsAgainst: 55, goalsDiff: -18},
    { rank: 15, team: T(727, "Las Palmas"),       points: 36, played: 38, win: 9,  draw: 9,  loss: 20, goalsFor: 36, goalsAgainst: 61, goalsDiff: -25},
    { rank: 16, team: T(534, "Mallorca"),         points: 36, played: 38, win: 8,  draw: 12, loss: 18, goalsFor: 29, goalsAgainst: 44, goalsDiff: -15},
    { rank: 17, team: T(557, "Celta Vigo"),       points: 35, played: 38, win: 8,  draw: 11, loss: 19, goalsFor: 43, goalsAgainst: 60, goalsDiff: -17},
    { rank: 18, team: T(541, "Cadiz"),            points: 31, played: 38, win: 6,  draw: 13, loss: 19, goalsFor: 30, goalsAgainst: 55, goalsDiff: -25},
    { rank: 19, team: T(547, "Almeria"),          points: 21, played: 38, win: 4,  draw: 9,  loss: 25, goalsFor: 43, goalsAgainst: 76, goalsDiff: -33},
    { rank: 20, team: T(529, "Granada"),          points: 21, played: 38, win: 4,  draw: 9,  loss: 25, goalsFor: 39, goalsAgainst: 88, goalsDiff: -49},
  ],
  78: [ // Bundesliga 2023-24
    { rank: 1,  team: T(168, "Bayer Leverkusen"), points: 90, played: 34, win: 28, draw: 6,  loss: 0,  goalsFor: 89, goalsAgainst: 24, goalsDiff: 65 },
    { rank: 2,  team: T(172, "VfB Stuttgart"),    points: 73, played: 34, win: 23, draw: 4,  loss: 7,  goalsFor: 78, goalsAgainst: 39, goalsDiff: 39 },
    { rank: 3,  team: T(157, "Bayern Munich"),    points: 72, played: 34, win: 22, draw: 6,  loss: 6,  goalsFor: 94, goalsAgainst: 45, goalsDiff: 49 },
    { rank: 4,  team: T(173, "RB Leipzig"),       points: 65, played: 34, win: 19, draw: 8,  loss: 7,  goalsFor: 77, goalsAgainst: 44, goalsDiff: 33 },
    { rank: 5,  team: T(165, "Borussia Dortmund"),points: 63, played: 34, win: 18, draw: 9,  loss: 7,  goalsFor: 68, goalsAgainst: 43, goalsDiff: 25 },
    { rank: 6,  team: T(161, "Eintracht Frankfurt"),points:55,played: 34, win: 15, draw: 10, loss: 9,  goalsFor: 51, goalsAgainst: 42, goalsDiff: 9  },
    { rank: 7,  team: T(167, "Hoffenheim"),       points: 45, played: 34, win: 12, draw: 9,  loss: 13, goalsFor: 58, goalsAgainst: 67, goalsDiff: -9 },
    { rank: 8,  team: T(169, "Heidenheim"),       points: 43, played: 34, win: 12, draw: 7,  loss: 15, goalsFor: 49, goalsAgainst: 59, goalsDiff: -10},
    { rank: 9,  team: T(164, "Freiburg"),         points: 42, played: 34, win: 11, draw: 9,  loss: 14, goalsFor: 42, goalsAgainst: 49, goalsDiff: -7 },
    { rank: 10, team: T(163, "Wolfsburg"),        points: 40, played: 34, win: 10, draw: 10, loss: 14, goalsFor: 44, goalsAgainst: 55, goalsDiff: -11},
    { rank: 11, team: T(162, "Werder Bremen"),    points: 40, played: 34, win: 10, draw: 10, loss: 14, goalsFor: 49, goalsAgainst: 61, goalsDiff: -12},
    { rank: 12, team: T(176, "Augsburg"),         points: 38, played: 34, win: 9,  draw: 11, loss: 14, goalsFor: 42, goalsAgainst: 54, goalsDiff: -12},
    { rank: 13, team: T(160, "Gladbach"),         points: 37, played: 34, win: 9,  draw: 10, loss: 15, goalsFor: 60, goalsAgainst: 65, goalsDiff: -5 },
    { rank: 14, team: T(174, "Union Berlin"),     points: 30, played: 34, win: 7,  draw: 9,  loss: 18, goalsFor: 35, goalsAgainst: 62, goalsDiff: -27},
    { rank: 15, team: T(171, "Mainz"),            points: 28, played: 34, win: 6,  draw: 10, loss: 18, goalsFor: 35, goalsAgainst: 62, goalsDiff: -27},
    { rank: 16, team: T(166, "Bochum"),           points: 28, played: 34, win: 5,  draw: 13, loss: 16, goalsFor: 28, goalsAgainst: 57, goalsDiff: -29},
    { rank: 17, team: T(175, "Köln"),             points: 25, played: 34, win: 6,  draw: 7,  loss: 21, goalsFor: 28, goalsAgainst: 69, goalsDiff: -41},
    { rank: 18, team: T(179, "Darmstadt"),        points: 18, played: 34, win: 2,  draw: 12, loss: 20, goalsFor: 27, goalsAgainst: 78, goalsDiff: -51},
  ],
  135: [ // Serie A 2023-24
    { rank: 1,  team: T(505, "Inter Milan"),      points: 94, played: 38, win: 29, draw: 7,  loss: 2,  goalsFor: 89, goalsAgainst: 22, goalsDiff: 67 },
    { rank: 2,  team: T(492, "Juventus"),          points: 71, played: 38, win: 19, draw: 14, loss: 5,  goalsFor: 51, goalsAgainst: 25, goalsDiff: 26 },
    { rank: 3,  team: T(489, "AC Milan"),         points: 75, played: 38, win: 22, draw: 9,  loss: 7,  goalsFor: 76, goalsAgainst: 42, goalsDiff: 34 },
    { rank: 4,  team: T(487, "Atalanta"),         points: 69, played: 38, win: 20, draw: 9,  loss: 9,  goalsFor: 70, goalsAgainst: 42, goalsDiff: 28 },
    { rank: 5,  team: T(488, "Bologna"),          points: 68, played: 38, win: 20, draw: 8,  loss: 10, goalsFor: 57, goalsAgainst: 33, goalsDiff: 24 },
    { rank: 6,  team: T(499, "AS Roma"),          points: 63, played: 38, win: 18, draw: 9,  loss: 11, goalsFor: 65, goalsAgainst: 52, goalsDiff: 13 },
    { rank: 7,  team: T(497, "Lazio"),            points: 61, played: 38, win: 18, draw: 7,  loss: 13, goalsFor: 67, goalsAgainst: 58, goalsDiff: 9  },
    { rank: 8,  team: T(496, "Fiorentina"),       points: 60, played: 38, win: 16, draw: 12, loss: 10, goalsFor: 63, goalsAgainst: 52, goalsDiff: 11 },
    { rank: 9,  team: T(503, "Torino"),           points: 53, played: 38, win: 14, draw: 11, loss: 13, goalsFor: 53, goalsAgainst: 50, goalsDiff: 3  },
    { rank: 10, team: T(500, "Napoli"),           points: 53, played: 38, win: 14, draw: 11, loss: 13, goalsFor: 55, goalsAgainst: 48, goalsDiff: 7  },
    { rank: 11, team: T(494, "Genoa"),            points: 49, played: 38, win: 12, draw: 13, loss: 13, goalsFor: 46, goalsAgainst: 57, goalsDiff: -11},
    { rank: 12, team: T(515, "Monza"),            points: 46, played: 38, win: 12, draw: 10, loss: 16, goalsFor: 56, goalsAgainst: 64, goalsDiff: -8 },
    { rank: 13, team: T(502, "Hellas Verona"),    points: 41, played: 38, win: 9,  draw: 14, loss: 15, goalsFor: 48, goalsAgainst: 60, goalsDiff: -12},
    { rank: 14, team: T(480, "Lecce"),            points: 38, played: 38, win: 9,  draw: 11, loss: 18, goalsFor: 36, goalsAgainst: 56, goalsDiff: -20},
    { rank: 15, team: T(511, "Udinese"),          points: 38, played: 38, win: 8,  draw: 14, loss: 16, goalsFor: 36, goalsAgainst: 50, goalsDiff: -14},
    { rank: 16, team: T(504, "Empoli"),           points: 37, played: 38, win: 9,  draw: 10, loss: 19, goalsFor: 32, goalsAgainst: 56, goalsDiff: -24},
    { rank: 17, team: T(490, "Cagliari"),         points: 36, played: 38, win: 9,  draw: 9,  loss: 20, goalsFor: 39, goalsAgainst: 68, goalsDiff: -29},
    { rank: 18, team: T(506, "Frosinone"),        points: 35, played: 38, win: 8,  draw: 11, loss: 19, goalsFor: 43, goalsAgainst: 72, goalsDiff: -29},
    { rank: 19, team: T(514, "Veglia"),           points: 32, played: 38, win: 7,  draw: 11, loss: 20, goalsFor: 33, goalsAgainst: 70, goalsDiff: -37},
    { rank: 20, team: T(491, "Sassuolo"),         points: 30, played: 38, win: 5,  draw: 15, loss: 18, goalsFor: 42, goalsAgainst: 72, goalsDiff: -30},
  ],
  61: [ // Ligue 1 2023-24
    { rank: 1,  team: T(85,  "Paris SG"),         points: 82, played: 34, win: 26, draw: 4,  loss: 4,  goalsFor: 86, goalsAgainst: 25, goalsDiff: 61 },
    { rank: 2,  team: T(95,  "Monaco"),           points: 71, played: 34, win: 21, draw: 8,  loss: 5,  goalsFor: 73, goalsAgainst: 36, goalsDiff: 37 },
    { rank: 3,  team: T(116, "Brest"),            points: 65, played: 34, win: 20, draw: 5,  loss: 9,  goalsFor: 51, goalsAgainst: 32, goalsDiff: 19 },
    { rank: 4,  team: T(80,  "Lille"),            points: 63, played: 34, win: 18, draw: 9,  loss: 7,  goalsFor: 55, goalsAgainst: 36, goalsDiff: 19 },
    { rank: 5,  team: T(84,  "Lyon"),             points: 60, played: 34, win: 17, draw: 9,  loss: 8,  goalsFor: 71, goalsAgainst: 55, goalsDiff: 16 },
    { rank: 6,  team: T(91,  "Marseille"),        points: 55, played: 34, win: 16, draw: 7,  loss: 11, goalsFor: 66, goalsAgainst: 57, goalsDiff: 9  },
    { rank: 7,  team: T(93,  "Nice"),             points: 55, played: 34, win: 16, draw: 7,  loss: 11, goalsFor: 52, goalsAgainst: 39, goalsDiff: 13 },
    { rank: 8,  team: T(97,  "Nantes"),           points: 45, played: 34, win: 12, draw: 9,  loss: 13, goalsFor: 39, goalsAgainst: 41, goalsDiff: -2 },
    { rank: 9,  team: T(94,  "Rennes"),           points: 43, played: 34, win: 12, draw: 7,  loss: 15, goalsFor: 45, goalsAgainst: 49, goalsDiff: -4 },
    { rank: 10, team: T(92,  "Lens"),             points: 43, played: 34, win: 12, draw: 7,  loss: 15, goalsFor: 40, goalsAgainst: 48, goalsDiff: -8 },
  ],
  2: [ // Champions League
    { rank: 1,  team: T(541, "Real Madrid"),  points: 18, played: 6, win: 6, draw: 0, loss: 0, goalsFor: 20, goalsAgainst: 6,  goalsDiff: 14 },
    { rank: 2,  team: T(157, "Bayern Munich"),points: 15, played: 6, win: 5, draw: 0, loss: 1, goalsFor: 17, goalsAgainst: 8,  goalsDiff: 9  },
    { rank: 3,  team: T(50,  "Man City"),     points: 13, played: 6, win: 4, draw: 1, loss: 1, goalsFor: 14, goalsAgainst: 7,  goalsDiff: 7  },
    { rank: 4,  team: T(529, "Barcelona"),    points: 12, played: 6, win: 4, draw: 0, loss: 2, goalsFor: 16, goalsAgainst: 11, goalsDiff: 5  },
  ],
};

const MOCK_TOP_SCORERS = {
  39:  [{ player: { id: 1100, name: "Erling Haaland" },   statistics: [{ goals: { total: 27 } }] }, { player: { id: 306, name: "Mo Salah" },         statistics: [{ goals: { total: 18 } }] }, { player: { id: 627, name: "Ollie Watkins" },       statistics: [{ goals: { total: 19 } }] }],
  140: [{ player: { id: 521, name: "Jude Bellingham" },   statistics: [{ goals: { total: 23 } }] }, { player: { id: 276, name: "Vinicius Jr." },       statistics: [{ goals: { total: 24 } }] }, { player: { id: 154, name: "Ferran Torres" },       statistics: [{ goals: { total: 14 } }] }],
  78:  [{ player: { id: 322, name: "Harry Kane" },        statistics: [{ goals: { total: 36 } }] }, { player: { id: 567, name: "Granit Xhaka" },       statistics: [{ goals: { total: 9  } }] }, { player: { id: 631, name: "Florian Wirtz" },       statistics: [{ goals: { total: 18 } }] }],
  135: [{ player: { id: 730, name: "Lautaro Martínez" },  statistics: [{ goals: { total: 24 } }] }, { player: { id: 290, name: "Ciro Immobile" },       statistics: [{ goals: { total: 12 } }] }, { player: { id: 874, name: "Federico Chiesa" },     statistics: [{ goals: { total: 11 } }] }],
  61:  [{ player: { id: 276, name: "Kylian Mbappé" },     statistics: [{ goals: { total: 27 } }] }, { player: { id: 162, name: "Alexandre Lacazette" },  statistics: [{ goals: { total: 19 } }] }, { player: { id: 154, name: "Wissam Ben Yedder" },  statistics: [{ goals: { total: 16 } }] }],
};

// ── Fixtures/Live Scores ─────────────────────────────────────
export const MOCK_FIXTURES = [
  {
    fixture: { id: 101, status: { short: "FT" }, date: new Date().toISOString() },
    league: { name: "Premier League", id: 39 },
    teams: {
      home: { name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png" },
      away: { name: "Chelsea",   logo: "https://media.api-sports.io/football/teams/49.png" },
    },
    goals: { home: 4, away: 1 },
  },
  {
    fixture: { id: 102, status: { short: "LIVE", elapsed: 72 }, date: new Date().toISOString() },
    league: { name: "La Liga", id: 140 },
    teams: {
      home: { name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png" },
      away: { name: "Barcelona",   logo: "https://media.api-sports.io/football/teams/529.png" },
    },
    goals: { home: 2, away: 2 },
  },
  {
    fixture: { id: 103, status: { short: "NS" }, date: new Date().toISOString() },
    league: { name: "Bundesliga", id: 78 },
    teams: {
      home: { name: "Bayern Munich",     logo: "https://media.api-sports.io/football/teams/157.png" },
      away: { name: "Bayer Leverkusen",  logo: "https://media.api-sports.io/football/teams/168.png" },
    },
    goals: { home: null, away: null },
  },
];

const LEAGUE_META = {
  39:  { name: "Premier League",        logo: "https://media.api-sports.io/football/leagues/39.png"  },
  140: { name: "La Liga",               logo: "https://media.api-sports.io/football/leagues/140.png" },
  78:  { name: "Bundesliga",            logo: "https://media.api-sports.io/football/leagues/78.png"  },
  135: { name: "Serie A",               logo: "https://media.api-sports.io/football/leagues/135.png" },
  61:  { name: "Ligue 1",               logo: "https://media.api-sports.io/football/leagues/61.png"  },
  2:   { name: "Champions League",      logo: "https://media.api-sports.io/football/leagues/2.png"   },
  3:   { name: "Europa League",         logo: "https://media.api-sports.io/football/leagues/3.png"   },
};

// ── Club fallback data ───────────────────────────────────────
const MOCK_CLUBS = {
  40:  { team: { id: 40,  name: "Liverpool",    logo: "https://media.api-sports.io/football/teams/40.png",  country: "England", founded: 1892, code: "LIV" }, venue: { name: "Anfield",        city: "Liverpool",   capacity: 61276 } },
  541: { team: { id: 541, name: "Real Madrid",  logo: "https://media.api-sports.io/football/teams/541.png",country: "Spain",   founded: 1902, code: "RMA" }, venue: { name: "Bernabéu",       city: "Madrid",      capacity: 81044 } },
  50:  { team: { id: 50,  name: "Man City",     logo: "https://media.api-sports.io/football/teams/50.png", country: "England", founded: 1880, code: "MCI" }, venue: { name: "Etihad Stadium",  city: "Manchester", capacity: 53400 } },
  529: { team: { id: 529, name: "Barcelona",    logo: "https://media.api-sports.io/football/teams/529.png",country: "Spain",   founded: 1899, code: "FCB" }, venue: { name: "Spotify Camp Nou",city: "Barcelona",  capacity: 99354 } },
  33:  { team: { id: 33,  name: "Man United",   logo: "https://media.api-sports.io/football/teams/33.png", country: "England", founded: 1878, code: "MUN" }, venue: { name: "Old Trafford",    city: "Manchester", capacity: 74140 } },
  157: { team: { id: 157, name: "Bayern Munich",logo: "https://media.api-sports.io/football/teams/157.png",country: "Germany", founded: 1900, code: "FCB" }, venue: { name: "Allianz Arena",   city: "Munich",     capacity: 75024 } },
  42:  { team: { id: 42,  name: "Arsenal",      logo: "https://media.api-sports.io/football/teams/42.png", country: "England", founded: 1886, code: "ARS" }, venue: { name: "Emirates Stadium",city: "London",     capacity: 60260 } },
  505: { team: { id: 505, name: "Inter Milan",  logo: "https://media.api-sports.io/football/teams/505.png",country: "Italy",   founded: 1908, code: "INT" }, venue: { name: "San Siro",        city: "Milan",      capacity: 80018 } },
};

const MOCK_SQUAD_BASE = [
  { id: 1001, name: "[GK] Goalkeeper",  position: "Goalkeeper", number: 1,  age: 28, nationality: "Brazil"  },
  { id: 1002, name: "[RB] Right Back",   position: "Defender",   number: 2,  age: 25, nationality: "England" },
  { id: 1003, name: "[CB] Centre Back",  position: "Defender",   number: 4,  age: 27, nationality: "Holland" },
  { id: 1004, name: "[CB] Centre Back",  position: "Defender",   number: 5,  age: 26, nationality: "France"  },
  { id: 1005, name: "[LB] Left Back",    position: "Defender",   number: 3,  age: 24, nationality: "Scotland"},
  { id: 1006, name: "[CM] Midfielder",   position: "Midfielder", number: 8,  age: 22, nationality: "Germany" },
  { id: 1007, name: "[CM] Midfielder",   position: "Midfielder", number: 10, age: 23, nationality: "Spain"   },
  { id: 1008, name: "[CDM] Midfielder",  position: "Midfielder", number: 6,  age: 28, nationality: "Japan"   },
  { id: 1009, name: "[RW] Winger",       position: "Attacker",   number: 11, age: 25, nationality: "Egypt"   },
  { id: 1010, name: "[ST] Striker",      position: "Attacker",   number: 9,  age: 24, nationality: "Uruguay" },
  { id: 1011, name: "[LW] Winger",       position: "Attacker",   number: 7,  age: 21, nationality: "Holland" },
];

export const getMockResponse = (key, params = {}) => {
  const leagueId = params.league || params.id;

  switch (key) {
    case "standings":
      return {
        response: [{
          league: {
            ...LEAGUE_META[leagueId],
            standings: [MOCK_STANDINGS[leagueId] || MOCK_STANDINGS[39]],
          },
        }],
      };
    case "fixtures":
      return { response: MOCK_FIXTURES };
    case "players":
    case "squad": {
      const squad = MOCK_SQUAD_BASE.map(p => ({ ...p, id: p.id + (leagueId || 0) }));
      return { response: squad };
    }
    case "club":
      return { response: [MOCK_CLUBS[leagueId] || MOCK_CLUBS[40]] };
    case "search":
      return {
        teams: [
          { team: { id: 33,  name: "Man United",    logo: "https://media.api-sports.io/football/teams/33.png",  country: "England" } },
          { team: { id: 40,  name: "Liverpool",      logo: "https://media.api-sports.io/football/teams/40.png",  country: "England" } },
          { team: { id: 541, name: "Real Madrid",    logo: "https://media.api-sports.io/football/teams/541.png", country: "Spain" } },
          { team: { id: 50,  name: "Man City",       logo: "https://media.api-sports.io/football/teams/50.png",  country: "England" } },
          { team: { id: 529, name: "Barcelona",      logo: "https://media.api-sports.io/football/teams/529.png", country: "Spain" } },
        ],
      };
    case "compare":
      return {
        data: (params.ids || []).map(id => ({
          league: LEAGUE_META[id] || { name: `League ${id}`, logo: "" },
          standings: MOCK_STANDINGS[id] || MOCK_STANDINGS[39],
          topScorers: MOCK_TOP_SCORERS[id] || MOCK_TOP_SCORERS[39],
        })),
      };
    case "prediction":
      return {
        prediction: {
          confidence: "High",
          homeWin: 45,
          draw: 28,
          awayWin: 27,
          expectedGoals: { home: 1.8, away: 1.1 }
        },
        homeTeam: { form: ["W", "W", "D", "W", "L"] },
        awayTeam: { form: ["D", "L", "W", "D", "D"] }
      };
    default:
      return { response: [] };
  }
};
