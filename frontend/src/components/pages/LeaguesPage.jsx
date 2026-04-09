// GoalBeat AI — Leagues Explorer (Card Grid with hover details)
import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Star, Trophy, Users, Calendar } from "lucide-react";
import { LEAGUES, COUNTRIES, TYPES } from "../../lib/constants";
import { useStore } from "../../store/useStore";

const TYPE_LABELS = { league: "League", tournament: "Tournament", cup: "Cup" };

const LEAGUE_DETAILS = {
  39:  { teams: 20, goals: "2.8/match", founded: 1992, topClub: "Man City", color: "#3d195b" },
  140: { teams: 20, goals: "2.6/match", founded: 1929, topClub: "Real Madrid", color: "#ee8707" },
  78:  { teams: 18, goals: "3.1/match", founded: 1963, topClub: "Bayern Munich", color: "#d20515" },
  135: { teams: 20, goals: "2.5/match", founded: 1898, topClub: "Inter Milan", color: "#003DA5" },
  61:  { teams: 18, goals: "2.7/match", founded: 1933, topClub: "PSG", color: "#004170" },
  2:   { teams: 36, goals: "3.2/match", founded: 1955, topClub: "Real Madrid", color: "#1b3973" },
  3:   { teams: 32, goals: "2.9/match", founded: 2009, topClub: "Seville", color: "#f37020" },
  88:  { teams: 18, goals: "3.3/match", founded: 1956, topClub: "Ajax", color: "#d2122e" },
  253: { teams: 29, goals: "2.9/match", founded: 1993, topClub: "LA Galaxy", color: "#003087" },
  71:  { teams: 20, goals: "2.7/match", founded: 1959, topClub: "Flamengo", color: "#d30000" },
};

export default function LeaguesPage() {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("All");
  const [hoveredId, setHoveredId] = useState(null);
  const { addFavoriteLeague, removeFavoriteLeague, isFavoriteLeague } = useStore();

  const filtered = useMemo(() => {
    return LEAGUES.filter((l) => {
      const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
        l.country.toLowerCase().includes(search.toLowerCase());
      const matchType = selectedType === "All" || l.type === selectedType;
      return matchSearch && matchType;
    });
  }, [search, selectedType]);

  const toggleFav = (e, league) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavoriteLeague(league.id)) removeFavoriteLeague(league.id);
    else addFavoriteLeague({ id: league.id, name: league.name, logo: league.logo });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="section-eyebrow mb-2">Competitions</p>
        <h1 className="section-title mb-4">LEAGUE EXPLORER</h1>
        <p className="text-chalk-400 max-w-xl">
          Browse all major football competitions worldwide. Hover to preview, click to dive deep.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-chalk-600" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leagues, countries..."
            className="input-field w-full pl-10"
          />
        </div>
        <div className="flex gap-2">
          {["All", "league", "tournament", "cup"].map(t => (
            <button
              key={t}
              onClick={() => setSelectedType(t)}
              className={`px-4 py-2 rounded-lg border text-xs font-bold uppercase transition-all ${
                selectedType === t
                  ? "border-grass-500 text-grass-400 bg-grass-500/10"
                  : "border-white/10 text-chalk-500 hover:border-white/30 hover:text-white"
              }`}
            >
              {t === "All" ? "All" : TYPE_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <p className="text-chalk-600 text-xs mb-6 font-mono">{filtered.length} competitions</p>

      {/* Card Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((league, i) => {
          const details = LEAGUE_DETAILS[league.id] || {};
          const isHovered = hoveredId === league.id;
          const isFav = isFavoriteLeague(league.id);
          return (
            <motion.div
              key={league.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: Math.min(i * 0.03, 0.3) }}
              onMouseEnter={() => setHoveredId(league.id)}
              onMouseLeave={() => setHoveredId(null)}
              className="relative"
            >
              <Link
                to={`/league/${league.id}`}
                className="group block relative overflow-hidden rounded-2xl border border-white/[0.08] bg-pitch-900 transition-all duration-300 hover:border-white/20 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] glimpse-hover"
                style={{ minHeight: 240 }}
              >
                {/* Large Background Logo */}
                <div className="absolute -right-4 -bottom-4 w-48 h-48 opacity-[0.07] pointer-events-none group-hover:opacity-[0.12] transition-opacity duration-500">
                  <img
                    src={league.logo}
                    alt=""
                    className="w-full h-full object-contain grayscale group-hover:grayscale-0 brightness-200 group-hover:brightness-100 transition-all duration-700"
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                </div>

                {/* Subtle colored accent from league brand */}
                <div
                  className="absolute inset-0 opacity-5 transition-opacity duration-300"
                  style={{
                    background: details.color
                      ? `radial-gradient(circle at top right, ${details.color}, transparent 70%)`
                      : "none",
                    opacity: isHovered ? 0.15 : 0.05,
                  }}
                />

                {/* Main content */}
                <div className="relative p-6 h-full flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Top row: logo + fav */}
                    <div className="flex items-start justify-between">
                      <div className="w-14 h-14 flex items-center justify-center bg-white/[0.04] rounded-xl p-2.5 backdrop-blur-sm border border-white/5">
                        <img
                          src={league.logo}
                          alt={league.name}
                          className="w-full h-full object-contain"
                          onError={(e) => { e.target.style.display = "none"; }}
                        />
                      </div>
                      <button
                        onClick={(e) => toggleFav(e, league)}
                        className={`p-2 rounded-xl transition-all ${
                          isFav ? "text-amber-400 bg-amber-400/10" : "text-chalk-700 hover:text-amber-400 hover:bg-amber-400/10"
                        }`}
                      >
                        <Star size={15} fill={isFav ? "currentColor" : "none"} />
                      </button>
                    </div>

                    {/* League name + country */}
                    <div>
                      <p className={`font-bold text-base leading-tight transition-colors duration-200 ${isHovered ? "text-grass-400" : "text-white"}`}>
                        {league.name}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-chalk-600 text-xs">{league.country}</span>
                        <span className="text-chalk-800">·</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${
                          league.type === "cup" ? "bg-amber-500/10 text-amber-400" :
                          league.type === "tournament" ? "bg-blue-500/10 text-blue-400" :
                          "bg-grass-500/10 text-grass-400"
                        }`}>
                          {TYPE_LABELS[league.type]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover details */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-white/[0.06] grid grid-cols-2 gap-2">
                          {details.teams && (
                            <div className="flex items-center gap-1.5">
                              <Users size={10} className="text-chalk-600 shrink-0"/>
                              <span className="text-chalk-400 text-[10px]">{details.teams} clubs</span>
                            </div>
                          )}
                          {details.founded && (
                            <div className="flex items-center gap-1.5">
                              <Calendar size={10} className="text-chalk-600 shrink-0"/>
                              <span className="text-chalk-400 text-[10px]">Est. {details.founded}</span>
                            </div>
                          )}
                          {details.goals && (
                            <div className="flex items-center gap-1.5">
                              <Trophy size={10} className="text-grass-500 shrink-0"/>
                              <span className="text-chalk-400 text-[10px]">{details.goals}</span>
                            </div>
                          )}
                          {details.topClub && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-[8px] text-amber-400 font-bold">CUR. CHAMP</span>
                              <span className="text-chalk-400 text-[10px] truncate">{details.topClub}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="text-grass-400 text-[10px] font-bold uppercase tracking-wider">View League →</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-24 opacity-30">
          <Trophy className="w-12 h-12 mx-auto mb-4 text-chalk-600" />
          <p className="text-chalk-400">No leagues match your filters.</p>
          <button onClick={() => { setSearch(""); setSelectedType("All"); }} className="text-grass-500 text-sm mt-2 hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
