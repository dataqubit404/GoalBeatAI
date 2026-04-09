// GoalBeat AI — Top Scorers
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

export default function TopScorers({ scorers }) {
  if (!scorers || scorers.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">⚽</p>
        <p className="text-chalk-400">Scorer data not available yet.</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center gap-3 text-chalk-600 text-xs font-mono uppercase tracking-wider">
        <span className="w-6">#</span>
        <span className="flex-1">Player</span>
        <span className="w-20 text-center hidden sm:block">Club</span>
        <span className="w-12 text-center">Goals</span>
        <span className="w-12 text-center hidden md:block">Assists</span>
        <span className="w-16 text-center hidden md:block">Mins</span>
      </div>

      {scorers.slice(0, 20).map((entry, i) => {
        const player = entry.player;
        const stats = entry.statistics?.[0];
        const team = stats?.team;
        const goals = stats?.goals?.total ?? 0;
        const assists = stats?.goals?.assists ?? 0;
        const minutes = stats?.games?.minutes ?? 0;

        return (
          <motion.div
            key={player.id}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="flex items-center gap-3 px-4 py-2.5 border-b border-white/[0.04] hover:bg-white/[0.03] transition-colors"
          >
            {/* Rank */}
            <span className={`w-6 text-center text-sm font-mono font-semibold ${
              i === 0 ? "text-amber-400" : i === 1 ? "text-chalk-200" : i === 2 ? "text-amber-600" : "text-chalk-600"
            }`}>
              {i + 1}
            </span>

            {/* Player */}
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              {player.photo ? (
                <img src={player.photo} alt={player.name} className="w-7 h-7 rounded-full object-cover bg-white/[0.05] shrink-0" />
              ) : (
                <div className="w-7 h-7 rounded-full bg-white/[0.05] shrink-0 flex items-center justify-center text-xs text-chalk-600">
                  {player.name?.[0]}
                </div>
              )}
              <div className="min-w-0">
                <a
                  href={`https://www.google.com/search?q=${encodeURIComponent(player.name + " footballer")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm hover:text-grass-400 transition-colors flex items-center gap-1 group truncate"
                  onClick={(e) => e.stopPropagation()}
                >
                  {player.name}
                  <ExternalLink size={10} className="opacity-0 group-hover:opacity-50 shrink-0" />
                </a>
                <p className="text-chalk-600 text-xs">{player.nationality}</p>
              </div>
            </div>

            {/* Club */}
            <div className="w-20 hidden sm:flex items-center gap-1.5 justify-center">
              {team?.logo && <img src={team.logo} alt="" className="w-4 h-4 object-contain" />}
              <Link to={`/club/${team?.id}`} className="text-chalk-400 text-xs hover:text-white truncate transition-colors">
                {team?.name}
              </Link>
            </div>

            {/* Stats */}
            <span className="w-12 text-center font-display text-lg text-grass-400">{goals}</span>
            <span className="w-12 text-center text-chalk-400 text-sm hidden md:block">{assists}</span>
            <span className="w-16 text-center text-chalk-600 text-xs font-mono hidden md:block">{minutes}'</span>
          </motion.div>
        );
      })}
    </div>
  );
}
