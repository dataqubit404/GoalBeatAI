// GoalBeat AI — API Client
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  timeout: 15000,
});

// Response interceptor
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const msg = err.response?.data?.error || err.message || "API error";
    console.error("API Error:", msg);
    return Promise.reject(new Error(msg));
  }
);

import { getMockResponse } from "./mockData";

// Wrapper for API calls with fallback
const withFallback = async (apiCall, mockKey, mockParams = {}) => {
  try {
    const data = await apiCall();
    if (!data || (data.response && data.response.length === 0)) {
       return getMockResponse(mockKey, mockParams);
    }
    return data;
  } catch (err) {
    console.warn(`Falling back to mock data for ${mockKey}:`, err.message);
    return getMockResponse(mockKey, mockParams);
  }
};

// ── API Methods ──────────────────────────────────────────────
export const footballAPI = {
  // Leagues
  getLeagueInfo: (id) => withFallback(() => api.get(`/leagues/${id}`), "league", { id }),
  getLeagueStandings: (id, season) => withFallback(() => api.get(`/leagues/${id}/standings`, { params: { season } }), "standings", { league: id }),
  getLeagueScorers: (id, season) => withFallback(() => api.get(`/leagues/${id}/scorers`, { params: { season } }), "scorers", { league: id }),
  getLeagueAssists: (id, season) => withFallback(() => api.get(`/leagues/${id}/assists`, { params: { season } }), "assists", { league: id }),
  getNextFixtures: (id, next = 10) => withFallback(() => api.get(`/leagues/${id}/fixtures/next`, { params: { next } }), "fixtures", { league: id }),
  getLastFixtures: (id, last = 10) => withFallback(() => api.get(`/leagues/${id}/fixtures/last`, { params: { last } }), "fixtures", { league: id }),

  // Matches
  getLiveMatches: () => withFallback(() => api.get("/matches/live"), "fixtures"),
  getMatchById: (id) => withFallback(() => api.get(`/matches/${id}`), "fixtures"),
  
  // Clubs
  getClub: (id) => withFallback(() => api.get(`/clubs/${id}`), "club"),
  getClubPlayers: (id) => withFallback(() => api.get(`/clubs/${id}/players`), "players"),

  // Search
  search: (q, type = "all") => withFallback(() => api.get("/search", { params: { q, type } }), "search"),
  
  // Predict
  predictMatch: (fixtureId) => withFallback(() => api.get(`/predict/${fixtureId}`), "prediction"),

  // Compare
  compareLeagues: (ids, season) =>
    withFallback(
      () => api.get("/compare", { params: { leagues: ids.join(","), season } }),
      "compare",
      { ids, season }
    ),
};
