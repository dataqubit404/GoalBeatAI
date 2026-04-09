// GoalBeat AI — League Comparison Page
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, BarChart3, RefreshCw, ChevronRight } from "lucide-react";
import { LEAGUES, LEAGUE_BY_ID } from "../../lib/constants";
import { footballAPI } from "../../lib/api";
import { useStore } from "../../store/useStore";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function ComparePage() {
  const { compareLeagues, addCompareLeague, removeCompareLeague, clearCompare } = useStore();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState("");
  const [hasCompared, setHasCompared] = useState(false);

  // Reset comparison data when leagues change
  useEffect(() => {
    setHasCompared(false);
    setData(null);
  }, [compareLeagues]);

  const handleCompare = async () => {
    if (compareLeagues.length === 0) return;
    setLoading(true);
    setHasCompared(true);
    try {
      const res = await footballAPI.compareLeagues(compareLeagues);
      // Mock returns { data: [...] }, real API may return the array directly
      const result = Array.isArray(res) ? res : res?.data;
      if (result && result.length > 0) {
        setData(result);
      } else {
        // Build directly from mock as last resort
        const { getMockResponse } = await import('../../lib/mockData');
        const fallback = getMockResponse('compare', { ids: compareLeagues });
        setData(fallback.data);
      }
    } catch (e) {
      console.warn("Compare API failed, using mock:", e.message);
      try {
        const { getMockResponse } = await import('../../lib/mockData');
        const fallback = getMockResponse('compare', { ids: compareLeagues });
        setData(fallback.data);
      } catch (e2) {
        setData(null);
      }
    } finally {
      setLoading(false);
    }
  };

  const availableLeagues = LEAGUES.filter(
    (l) => !compareLeagues.includes(l.id)
  ).filter((l) =>
    l.name.toLowerCase().includes(pickerSearch.toLowerCase()) ||
    l.country.toLowerCase().includes(pickerSearch.toLowerCase())
  );

  const chartData = data?.map((d) => ({
    name: d.league?.name?.substring(0, 14) || "?",
    Teams: d.standings?.length || 0,
    "Top Scorer Goals": d.topScorers?.[0]?.statistics?.[0]?.goals?.total || 0,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <p className="section-eyebrow mb-2">Analytics</p>
        <h1 className="section-title mb-3">LEAGUE COMPARISON</h1>
        <p className="text-chalk-400 max-w-xl">
          Select up to 3 competitions, then click <strong className="text-white">Compare</strong> to see points tables and top scorers side-by-side.
        </p>
      </div>

      {/* League Selector */}
      <div className="glass border border-white/10 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold uppercase tracking-wider text-sm">
            Select Leagues ({compareLeagues.length}/3)
          </h3>
          {compareLeagues.length > 0 && (
            <button onClick={clearCompare} className="text-chalk-600 hover:text-red-400 text-xs transition-colors">
              Clear All
            </button>
          )}
        </div>
        <input
          value={pickerSearch}
          onChange={(e) => setPickerSearch(e.target.value)}
          placeholder="Search leagues (e.g. Premier League, Bundesliga)..."
          className="input-field w-full mb-5"
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {availableLeagues.slice(0, 12).map((l) => (
            <button
              key={l.id}
              onClick={() => addCompareLeague(l.id)}
              disabled={compareLeagues.length >= 3}
              className="flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 hover:border-grass-500/50 hover:bg-grass-500/5 transition-all group disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <img
                src={l.logo}
                alt={l.name}
                className="w-10 h-10 object-contain group-hover:scale-110 transition-transform"
                onError={(e) => { e.target.style.display='none'; }}
              />
              <div className="text-center">
                <p className="text-white text-[10px] font-bold leading-tight truncate w-full">{l.name}</p>
                <p className="text-chalk-600 text-[9px] uppercase tracking-wider mt-0.5">{l.country}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Selected + Compare Button */}
      <div className="flex flex-wrap items-center gap-3 mb-8">
        {compareLeagues.map((id) => {
          const meta = LEAGUE_BY_ID[id];
          return (
            <motion.div
              key={id}
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex items-center gap-2 px-3 py-2 rounded-full border border-grass-500/40 bg-grass-500/5"
            >
              <img src={meta?.logo} alt="" className="w-5 h-5 object-contain" onError={(e) => { e.target.style.display='none'; }} />
              <span className="text-white text-xs font-bold">{meta?.name || `League ${id}`}</span>
              <button
                onClick={() => removeCompareLeague(id)}
                className="ml-1 w-4 h-4 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors text-[10px]"
              >
                ×
              </button>
            </motion.div>
          );
        })}

        {compareLeagues.length >= 2 && (
          <button
            onClick={handleCompare}
            className="btn-primary gap-2 ml-auto"
          >
            <BarChart3 size={16} />
            COMPARE NOW
            <ChevronRight size={14} />
          </button>
        )}

        {compareLeagues.length === 1 && (
          <p className="text-chalk-600 text-xs ml-auto">Add 1 or 2 more leagues to compare</p>
        )}
      </div>

      {/* Empty state */}
      {compareLeagues.length === 0 && !loading && !data && (
        <div className="text-center py-24 opacity-30">
          <BarChart3 className="w-16 h-16 mx-auto mb-4 text-chalk-600" />
          <h3 className="text-white text-2xl font-bold mb-2">SELECT LEAGUES ABOVE</h3>
          <p className="text-chalk-400 text-sm">Pick at least 2 leagues, then hit Compare Now</p>
        </div>
      )}

      {compareLeagues.length > 0 && !hasCompared && !loading && (
        <div className="text-center py-20 glass border border-dashed border-white/10">
          <p className="text-5xl mb-4">📊</p>
          <h3 className="text-white text-xl font-bold mb-3 uppercase tracking-wider">Ready to Compare</h3>
          <p className="text-chalk-400 text-sm mb-6">
            {compareLeagues.length < 2 ? "Add one more league to unlock comparison" : "Click Compare Now to generate side-by-side analytics"}
          </p>
          {compareLeagues.length >= 2 && (
            <button onClick={handleCompare} className="btn-primary gap-2 mx-auto">
              <BarChart3 size={16} /> COMPARE NOW
            </button>
          )}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="py-24 text-center">
          <RefreshCw className="w-10 h-10 text-grass-500 animate-spin mx-auto mb-4" />
          <p className="text-chalk-400 font-bold uppercase tracking-widest text-sm">Analyzing competition data...</p>
        </div>
      )}

      {/* Results */}
      <AnimatePresence>
        {data && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Overview bar chart */}
            {chartData.length > 1 && (
              <div className="glass p-6">
                <p className="section-eyebrow mb-4">Stats Overview</p>
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={chartData} barGap={8}>
                    <XAxis dataKey="name" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ background: "#0a1520", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
                    />
                    <Legend />
                    <Bar dataKey="Teams" fill="#22c55e" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="Top Scorer Goals" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Points tables side-by-side */}
            <div>
              <p className="section-eyebrow mb-4">Points Tables</p>
              <div className={`grid gap-5 ${data.length === 2 ? "md:grid-cols-2" : "md:grid-cols-3"}`}>
                {data.map((d, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="glass overflow-hidden"
                  >
                    {/* League header */}
                    <div className="px-4 py-3 border-b border-white/[0.06] flex items-center gap-3 bg-white/[0.02]">
                      {d.league?.logo && (
                        <img src={d.league.logo} alt="" className="w-8 h-8 object-contain" />
                      )}
                      <div>
                        <p className="text-white text-sm font-bold">{d.league?.name}</p>
                        <p className="text-chalk-600 text-xs">{d.standings?.length} teams</p>
                      </div>
                    </div>

                    {/* Column headers */}
                    <div className="px-3 py-2 flex items-center gap-2 text-chalk-600 text-[10px] font-mono uppercase border-b border-white/[0.04]">
                      <span className="w-5">#</span>
                      <span className="flex-1">Club</span>
                      <span className="w-8 text-center">MP</span>
                      <span className="w-8 text-center">W</span>
                      <span className="w-8 text-center">D</span>
                      <span className="w-8 text-center">L</span>
                      <span className="w-10 text-center font-bold text-white/40">Pts</span>
                    </div>

                    {/* Standings rows */}
                    {d.standings?.slice(0, 20).map((entry, ri) => (
                      <div
                        key={entry.team?.id || ri}
                        className={`flex items-center gap-2 px-3 py-2 border-t border-white/[0.03] hover:bg-white/[0.03] transition-colors ${ri < 4 ? "border-l-2 border-grass-500/50" : ri >= (d.standings.length - 3) ? "border-l-2 border-red-500/40" : ""}`}
                      >
                        <span className={`w-5 text-center text-xs font-mono font-bold ${ri < 4 ? "text-grass-400" : ri >= d.standings.length - 3 ? "text-red-400" : "text-chalk-600"}`}>
                          {entry.rank}
                        </span>
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {entry.team?.logo && (
                            <img src={entry.team.logo} alt="" className="w-4 h-4 object-contain shrink-0" />
                          )}
                          <span className="text-white text-xs truncate">{entry.team?.name}</span>
                        </div>
                        <span className="w-8 text-center text-chalk-500 text-xs font-mono">{entry.played}</span>
                        <span className="w-8 text-center text-grass-400 text-xs font-mono">{entry.win}</span>
                        <span className="w-8 text-center text-chalk-500 text-xs font-mono">{entry.draw}</span>
                        <span className="w-8 text-center text-red-400 text-xs font-mono">{entry.loss}</span>
                        <span className="w-10 text-center text-white text-xs font-mono font-bold bg-white/5 rounded py-0.5">{entry.points}</span>
                      </div>
                    ))}

                    {/* Top Scorers */}
                    {d.topScorers?.length > 0 && (
                      <div className="border-t border-white/[0.06] bg-white/[0.01]">
                        <p className="px-4 pt-3 pb-1 text-chalk-600 text-[10px] font-mono uppercase tracking-wider">Top Scorers</p>
                        {d.topScorers.slice(0, 5).map((s, si) => (
                          <div key={s.player?.id || si} className="flex items-center gap-2 px-4 py-1.5 border-t border-white/[0.03]">
                            <span className="text-chalk-700 text-[10px] w-4">{si + 1}</span>
                            <span className="text-white text-xs flex-1 truncate">{s.player?.name}</span>
                            <span className="text-grass-400 font-mono text-sm font-bold">{s.statistics?.[0]?.goals?.total}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
