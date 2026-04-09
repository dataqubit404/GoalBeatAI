// GoalBeat AI — StandingsTable
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export default function StandingsTable({ standings, leagueId }) {
  if (!standings || standings.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📊</p>
        <p className="text-chalk-400">Standings not available yet.</p>
        <p className="text-chalk-600 text-sm mt-1">Season may not have started or API quota reached.</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.06] text-chalk-600 text-xs font-mono uppercase tracking-wider">
        <span className="w-6 text-center">#</span>
        <span className="flex-1">Club</span>
        <span className="w-8 text-center hidden sm:block">MP</span>
        <span className="w-8 text-center">W</span>
        <span className="w-8 text-center hidden sm:block">D</span>
        <span className="w-8 text-center hidden sm:block">L</span>
        <span className="w-10 text-center hidden md:block">GD</span>
        <span className="w-10 text-center">Pts</span>
        <span className="w-24 hidden lg:block">Form</span>
      </div>

      {standings.map((entry, i) => {
        const form = entry.form ? entry.form.split("") : [];
        return (
          <motion.div
            key={entry.team.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.025 }}
          >
            <Link to={`/club/${entry.team.id}`} className="flex items-center gap-3 px-4 py-2.5 border-t border-white/[0.04] hover:bg-white/[0.02] transition-colors group">
              {/* Rank */}
              <span className={`w-6 text-center text-sm font-mono font-medium ${
                entry.rank <= 4 ? "text-grass-400" :
                entry.rank === 5 ? "text-amber-300" :
                entry.rank >= standings.length - 2 ? "text-red-400" :
                "text-chalk-400"
              }`}>
                {entry.rank}
              </span>

              {/* Club */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                {entry.team.logo && (
                  <img src={entry.team.logo} alt={entry.team.name} className="w-5 h-5 object-contain shrink-0" />
                )}
                <span className="text-white text-sm truncate hover:text-grass-400 transition-colors">
                  {entry.team.name}
                </span>
              </div>

              {/* Stats */}
              <span className="w-8 text-center text-chalk-400 text-sm hidden sm:block">{entry.played}</span>
              <span className="w-8 text-center text-white text-sm">{entry.win}</span>
              <span className="w-8 text-center text-chalk-400 text-sm hidden sm:block">{entry.draw}</span>
              <span className="w-8 text-center text-chalk-400 text-sm hidden sm:block">{entry.loss}</span>
              <span className={`w-10 text-center text-sm font-mono hidden md:block ${
                entry.goalsDiff > 0 ? "text-grass-400" : entry.goalsDiff < 0 ? "text-red-400" : "text-chalk-400"
              }`}>
                {entry.goalsDiff > 0 ? `+${entry.goalsDiff}` : entry.goalsDiff}
              </span>
              <span className="w-10 text-center text-white font-semibold text-sm">{entry.points}</span>

              {/* Form */}
              <div className="w-24 hidden lg:flex items-center gap-0.5">
                {form.slice(0, 5).map((f, fi) => (
                  <span key={fi} className={
                    f === "W" ? "form-w" : f === "D" ? "form-d" : "form-l"
                  }>
                    {f}
                  </span>
                ))}
              </div>
            </Link>
          </motion.div>
        );
      })}

      {/* Legend */}
      <div className="px-4 py-3 border-t border-white/[0.04] flex items-center gap-4 text-xs text-chalk-600">
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-4 bg-grass-500 rounded-full" />
          <span>Champions League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-4 bg-amber-400 rounded-full" />
          <span>Europa League</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-1 h-4 bg-red-500 rounded-full" />
          <span>Relegation</span>
        </div>
      </div>
    </div>
  );
}
