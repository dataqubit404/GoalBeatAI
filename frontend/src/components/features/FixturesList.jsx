// GoalBeat AI — Fixtures List
import { useState } from "react";
import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import PredictionModal from "../ui/PredictionModal";

function FormattedDate({ dateStr }) {
  const d = new Date(dateStr);
  return (
    <span className="text-chalk-600 text-xs font-mono">
      {d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" })}
      {" · "}
      {d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function MatchRow({ fixture, onPredict }) {
  const isLive = fixture.fixture?.status?.short === "1H" ||
    fixture.fixture?.status?.short === "2H" ||
    fixture.fixture?.status?.short === "HT";

  return (
    <div className="border-b border-white/[0.04] last:border-0">
      <button
        onClick={onPredict}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors text-left group"
      >
        {/* Date/Status */}
        <div className="w-24 shrink-0">
          {isLive ? (
            <span className="badge-red text-xs">
              <span className="live-dot shrink-0" />
              {fixture.fixture?.status?.elapsed}'
            </span>
          ) : (
            <FormattedDate dateStr={fixture.fixture?.date} />
          )}
        </div>

        {/* Home team */}
        <div className="flex items-center gap-2 flex-1 justify-end min-w-0">
          <span className="text-white text-sm truncate group-hover:text-grass-400 transition-colors">
            {fixture.teams?.home?.name}
          </span>
          {fixture.teams?.home?.logo && (
            <img src={fixture.teams.home.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          )}
        </div>

        {/* Score */}
        <div className="shrink-0 w-16 text-center">
          <span className="text-chalk-600 font-mono text-sm">vs</span>
        </div>

        {/* Away team */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {fixture.teams?.away?.logo && (
            <img src={fixture.teams.away.logo} alt="" className="w-5 h-5 object-contain shrink-0" />
          )}
          <span className="text-white text-sm truncate group-hover:text-grass-400 transition-colors">
            {fixture.teams?.away?.name}
          </span>
        </div>

        <div className="w-8 flex justify-end">
          <Zap size={13} className="text-chalk-700 group-hover:text-grass-400 transition-colors" />
        </div>
      </button>
    </div>
  );
}

export default function FixturesList({ fixtures }) {
  const [selectedFixture, setSelectedFixture] = useState(null);

  if (!fixtures || fixtures.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">📅</p>
        <p className="text-chalk-400">No upcoming fixtures found.</p>
      </div>
    );
  }

  return (
    <div className="glass overflow-hidden relative">
      <div className="px-4 py-2.5 border-b border-white/[0.06] flex items-center justify-between">
        <span className="text-xs text-chalk-600 font-mono uppercase tracking-wider">Upcoming Matches</span>
        <span className="text-xs text-chalk-600">{fixtures.length} matches · Click to predict</span>
      </div>
      
      <div className="divide-y divide-white/[0.04]">
        {fixtures.map((f) => (
          <MatchRow 
            key={f.fixture.id} 
            fixture={f} 
            onPredict={() => setSelectedFixture(f)} 
          />
        ))}
      </div>

      <PredictionModal
        fixture={selectedFixture}
        isOpen={!!selectedFixture}
        onClose={() => setSelectedFixture(null)}
      />
    </div>
  );
}
