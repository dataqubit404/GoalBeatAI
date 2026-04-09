// GoalBeat AI — League Metadata & Constants

export const LEAGUES = [
  // ── Global ────────────────────────────────────────────────
  { id: 1,   slug: "world-cup",           name: "FIFA World Cup",          country: "World",       tier: "global", logo: "https://media.api-sports.io/football/leagues/1.png",   type: "tournament" },
  { id: 2,   slug: "champions-league",    name: "UEFA Champions League",   country: "Europe",      tier: "global", logo: "https://media.api-sports.io/football/leagues/2.png",   type: "tournament" },
  { id: 3,   slug: "europa-league",       name: "UEFA Europa League",      country: "Europe",      tier: "global", logo: "https://media.api-sports.io/football/leagues/3.png",   type: "tournament" },
  { id: 848, slug: "conference-league",   name: "UEFA Conference League",  country: "Europe",      tier: "global", logo: "https://media.api-sports.io/football/leagues/848.png", type: "tournament" },

  // ── Top 10 Domestic ───────────────────────────────────────
  { id: 39,  slug: "premier-league",      name: "Premier League",          country: "England",     tier: "1", logo: "https://media.api-sports.io/football/leagues/39.png",  type: "league", founded: 1992, teams: 20 },
  { id: 140, slug: "la-liga",             name: "La Liga",                 country: "Spain",       tier: "1", logo: "https://media.api-sports.io/football/leagues/140.png", type: "league", founded: 1929, teams: 20 },
  { id: 78,  slug: "bundesliga",          name: "Bundesliga",              country: "Germany",     tier: "1", logo: "https://media.api-sports.io/football/leagues/78.png",  type: "league", founded: 1963, teams: 18 },
  { id: 135, slug: "serie-a",             name: "Serie A",                 country: "Italy",       tier: "1", logo: "https://media.api-sports.io/football/leagues/135.png", type: "league", founded: 1898, teams: 20 },
  { id: 61,  slug: "ligue-1",             name: "Ligue 1",                 country: "France",      tier: "1", logo: "https://media.api-sports.io/football/leagues/61.png",  type: "league", founded: 1933, teams: 18 },
  { id: 88,  slug: "eredivisie",          name: "Eredivisie",              country: "Netherlands", tier: "1", logo: "https://media.api-sports.io/football/leagues/88.png",  type: "league", founded: 1956, teams: 18 },
  { id: 94,  slug: "primeira-liga",       name: "Primeira Liga",           country: "Portugal",    tier: "1", logo: "https://media.api-sports.io/football/leagues/94.png",  type: "league", founded: 1934, teams: 18 },
  { id: 203, slug: "super-lig",           name: "Süper Lig",               country: "Turkey",      tier: "1", logo: "https://media.api-sports.io/football/leagues/203.png", type: "league", founded: 1959, teams: 19 },
  { id: 144, slug: "pro-league",          name: "Belgian Pro League",      country: "Belgium",     tier: "1", logo: "https://media.api-sports.io/football/leagues/144.png", type: "league", founded: 1895, teams: 16 },
  { id: 179, slug: "scottish-premiership",name: "Scottish Premiership",    country: "Scotland",    tier: "1", logo: "https://media.api-sports.io/football/leagues/179.png", type: "league", founded: 1975, teams: 12 },

  // ── Other Top Leagues ─────────────────────────────────────
  { id: 253, slug: "mls",                 name: "MLS",                     country: "USA",         tier: "1", logo: "https://media.api-sports.io/football/leagues/253.png", type: "league", founded: 1993, teams: 29 },
  { id: 71,  slug: "brasileirao",         name: "Brasileirão",             country: "Brazil",      tier: "1", logo: "https://media.api-sports.io/football/leagues/71.png",  type: "league", founded: 1959, teams: 20 },
  { id: 128, slug: "argentine-primera",   name: "Argentine Primera",       country: "Argentina",   tier: "1", logo: "https://media.api-sports.io/football/leagues/128.png", type: "league", founded: 1891, teams: 28 },
  { id: 307, slug: "saudi-pro-league",    name: "Saudi Pro League",        country: "Saudi Arabia", tier: "1", logo: "https://media.api-sports.io/football/leagues/307.png", type: "league", founded: 1976, teams: 16 },
  { id: 98,  slug: "j-league",            name: "J1 League",               country: "Japan",       tier: "1", logo: "https://media.api-sports.io/football/leagues/98.png",  type: "league", founded: 1992, teams: 18 },

  // ── Domestic Cups ─────────────────────────────────────────
  { id: 45,  slug: "fa-cup",              name: "FA Cup",                  country: "England",     tier: "cup", logo: "https://media.api-sports.io/football/leagues/45.png",  type: "cup" },
  { id: 143, slug: "copa-del-rey",        name: "Copa del Rey",            country: "Spain",       tier: "cup", logo: "https://media.api-sports.io/football/leagues/143.png", type: "cup" },
  { id: 81,  slug: "dfb-pokal",           name: "DFB-Pokal",               country: "Germany",     tier: "cup", logo: "https://media.api-sports.io/football/leagues/81.png",  type: "cup" },
  { id: 137, slug: "coppa-italia",        name: "Coppa Italia",            country: "Italy",       tier: "cup", logo: "https://media.api-sports.io/football/leagues/137.png", type: "cup" },
  { id: 66,  slug: "coupe-de-france",     name: "Coupe de France",         country: "France",      tier: "cup", logo: "https://media.api-sports.io/football/leagues/66.png",  type: "cup" },
  { id: 48,  slug: "carabao-cup",         name: "Carabao Cup",             country: "England",     tier: "cup", logo: "https://media.api-sports.io/football/leagues/48.png",  type: "cup" },
];

export const LEAGUE_BY_ID = Object.fromEntries(LEAGUES.map((l) => [l.id, l]));
export const LEAGUE_BY_SLUG = Object.fromEntries(LEAGUES.map((l) => [l.slug, l]));

export const COUNTRIES = [...new Set(LEAGUES.map((l) => l.country))].sort();
export const TYPES = ["league", "tournament", "cup"];

// Formation presets for Squad Builder
export const FORMATIONS = [
  { name: "4-3-3",  positions: ["GK","RB","CB","CB","LB","CM","CM","CM","RW","ST","LW"] },
  { name: "4-4-2",  positions: ["GK","RB","CB","CB","LB","RM","CM","CM","LM","ST","ST"] },
  { name: "4-2-3-1",positions: ["GK","RB","CB","CB","LB","CDM","CDM","RAM","CAM","LAM","ST"] },
  { name: "3-5-2",  positions: ["GK","CB","CB","CB","WB","CM","CM","CM","WB","ST","ST"] },
  { name: "5-3-2",  positions: ["GK","RWB","CB","CB","CB","LWB","CM","CM","CM","ST","ST"] },
  { name: "3-4-3",  positions: ["GK","CB","CB","CB","RM","CM","CM","LM","RW","ST","LW"] },
  { name: "4-1-4-1",positions: ["GK","RB","CB","CB","LB","CDM","RM","CM","CM","LM","ST"] },
];

// Club legends data (static — for display + Google search redirect)
export const CLUB_LEGENDS = {
  33: [ // Manchester United
    { name: "Sir Bobby Charlton", years: "1956–1973", goals: 249 },
    { name: "George Best", years: "1963–1974", goals: 179 },
    { name: "Eric Cantona", years: "1992–1997", goals: 82 },
    { name: "Ryan Giggs", years: "1990–2014", goals: 168 },
    { name: "Wayne Rooney", years: "2004–2017", goals: 253 },
  ],
  40: [ // Liverpool
    { name: "Steven Gerrard", years: "1998–2015", goals: 186 },
    { name: "Kenny Dalglish", years: "1977–1990", goals: 172 },
    { name: "Ian Rush", years: "1980–1996", goals: 346 },
    { name: "John Barnes", years: "1987–1997", goals: 108 },
    { name: "Robbie Fowler", years: "1993–2007", goals: 183 },
  ],
  // Add more clubs as needed
};
