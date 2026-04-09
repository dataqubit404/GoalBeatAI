// GoalBeat AI — Match Page
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Clock, Users } from "lucide-react";
import { footballAPI } from "../../lib/api";
import LoadingSkeleton from "../ui/LoadingSkeleton";

export default function MatchPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fixtureId = parseInt(id);
  const [tab, setTab] = useState("prediction");
  const [match, setMatch] = useState(null);
  const [stats, setStats] = useState(null);
  const [events, setEvents] = useState([]);
  const [lineups, setLineups] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [matchRes, statsRes, eventsRes, lineupsRes, predRes] = await Promise.allSettled([
        footballAPI.getMatchById(fixtureId),
        footballAPI.getMatchStats(fixtureId),
        footballAPI.getMatchEvents(fixtureId),
        footballAPI.getMatchLineups(fixtureId),
        footballAPI.predictMatch(fixtureId),
      ]);
      if (matchRes.status === "fulfilled") setMatch(matchRes.value?.response?.[0]);
      if (statsRes.status === "fulfilled") setStats(statsRes.value?.response || []);
      if (eventsRes.status === "fulfilled") setEvents(eventsRes.value?.response || []);
      if (lineupsRes.status === "fulfilled") setLineups(lineupsRes.value?.response || []);
      if (predRes.status === "fulfilled") setPrediction(predRes.value);
      setLoading(false);
    };
    load();
  }, [fixtureId]);

  if (loading) return <div className="max-w-4xl mx-auto px-4 py-8"><LoadingSkeleton rows={8} /></div>;
  if (!match) return <div className="max-w-4xl mx-auto px-4 py-8 text-center text-chalk-400">Match not found.</div>;

  const fixture = match.fixture;
  const homeTeam = match.teams?.home;
  const awayTeam = match.teams?.away;
  const isLive = ["1H","2H","HT"].includes(fixture?.status?.short);
  const isFinished = ["FT","AET","PEN"].includes(fixture?.status?.short);

  const TABS = [
    { id: "prediction", label: "Prediction", icon: Zap },
    { id: "stats", label: "Stats", icon: "📊" },
    { id: "events", label: "Timeline", icon: Clock },
    { id: "lineups", label: "Lineups", icon: Users },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-chalk-600 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      {/* Match Header */}
      <div className="glass p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {match.league?.logo && <img src={match.league.logo} alt="" className="w-5 h-5 object-contain" />}
            <span className="text-chalk-400 text-sm">{match.league?.name}</span>
            <span className="text-chalk-600 text-xs">· Round {match.league?.round}</span>
          </div>
          {isLive ? (
            <span className="badge-red">
              <span className="live-dot" /> {fixture?.status?.elapsed}'
            </span>
          ) : isFinished ? (
            <span className="badge-green">Full Time</span>
          ) : (
            <span className="text-chalk-600 text-sm font-mono">
              {new Date(fixture?.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
            </span>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Home */}
          <div className="flex-1 flex flex-col items-center gap-2">
            {homeTeam?.logo && <img src={homeTeam.logo} alt={homeTeam.name} className="w-14 h-14 object-contain" />}
            <Link to={`/club/${homeTeam?.id}`} className="text-white font-semibold text-center hover:text-grass-400 transition-colors">
              {homeTeam?.name}
            </Link>
            <span className="badge-blue text-xs">Home</span>
          </div>

          {/* Score */}
          <div className="text-center px-6">
            {isFinished || isLive ? (
              <p className="font-display text-6xl text-white">
                {match.goals?.home ?? "–"} : {match.goals?.away ?? "–"}
              </p>
            ) : (
              <p className="font-display text-4xl text-chalk-400">vs</p>
            )}
            {fixture?.venue?.name && (
              <p className="text-chalk-600 text-xs mt-2">🏟 {fixture.venue.name}</p>
            )}
          </div>

          {/* Away */}
          <div className="flex-1 flex flex-col items-center gap-2">
            {awayTeam?.logo && <img src={awayTeam.logo} alt={awayTeam.name} className="w-14 h-14 object-contain" />}
            <Link to={`/club/${awayTeam?.id}`} className="text-white font-semibold text-center hover:text-grass-400 transition-colors">
              {awayTeam?.name}
            </Link>
            <span className="badge text-xs bg-white/[0.05] text-chalk-400 border border-white/10">Away</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] mb-6 overflow-x-auto">
        {TABS.map(({ id: tabId, label }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap relative transition-colors ${
              tab === tabId ? "text-white" : "text-chalk-400 hover:text-white"
            }`}
          >
            {label}
            {tab === tabId && (
              <motion.div layoutId="match-tab" className="absolute bottom-0 left-0 right-0 h-px bg-grass-500" />
            )}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        {tab === "prediction" && <PredictionTab prediction={prediction} homeTeam={homeTeam} awayTeam={awayTeam} />}
        {tab === "stats" && <StatsTab stats={stats} homeTeam={homeTeam} awayTeam={awayTeam} />}
        {tab === "events" && <EventsTab events={events} />}
        {tab === "lineups" && <LineupsTab lineups={lineups} />}
      </motion.div>
    </div>
  );
}

// ── Prediction Tab ────────────────────────────────────────────
function PredictionTab({ prediction, homeTeam, awayTeam }) {
  if (!prediction) return <div className="text-center py-12 text-chalk-400">Prediction not available.</div>;
  const p = prediction.prediction;
  return (
    <div className="space-y-4">
      <div className="glass p-5">
        <div className="flex items-center justify-between mb-4">
          <span className="section-eyebrow">Win Probability</span>
          <span className={`badge ${p.confidence === "High" ? "badge-green" : p.confidence === "Medium" ? "badge-amber" : "badge-red"}`}>
            {p.confidence} confidence
          </span>
        </div>
        {[
          { label: homeTeam?.name || "Home", val: p.homeWin, color: "bg-grass-500" },
          { label: "Draw", val: p.draw, color: "bg-amber-400" },
          { label: awayTeam?.name || "Away", val: p.awayWin, color: "bg-blue-500" },
        ].map((b) => (
          <div key={b.label} className="mb-3">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-chalk-400">{b.label}</span>
              <span className="font-mono text-white font-medium">{b.val}%</span>
            </div>
            <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${b.val}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`h-full ${b.color} rounded-full`}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="glass p-4">
          <p className="text-chalk-600 text-xs font-mono mb-1">xG Home</p>
          <p className="font-display text-3xl text-grass-400">{p.expectedGoals.home}</p>
        </div>
        <div className="glass p-4">
          <p className="text-chalk-600 text-xs font-mono mb-1">xG Away</p>
          <p className="font-display text-3xl text-blue-400">{p.expectedGoals.away}</p>
        </div>
      </div>
      <div className="glass p-4">
        <p className="text-chalk-600 text-xs font-mono mb-3">Last 5 Form</p>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-chalk-400 text-xs mb-1.5">{homeTeam?.name}</p>
            <div className="flex gap-1">
              {prediction.homeTeam.form.map((f, i) => (
                <span key={i} className={f === "W" ? "form-w" : f === "D" ? "form-d" : "form-l"}>{f}</span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-chalk-400 text-xs mb-1.5">{awayTeam?.name}</p>
            <div className="flex gap-1 justify-end">
              {prediction.awayTeam.form.map((f, i) => (
                <span key={i} className={f === "W" ? "form-w" : f === "D" ? "form-d" : "form-l"}>{f}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Stats Tab ─────────────────────────────────────────────────
function StatsTab({ stats, homeTeam, awayTeam }) {
  if (!stats || stats.length === 0) return <div className="text-center py-12 text-chalk-400">Match stats not available (match may not have started).</div>;

  const homeStats = stats.find((s) => s.team?.id === homeTeam?.id)?.statistics || [];
  const awayStats = stats.find((s) => s.team?.id === awayTeam?.id)?.statistics || [];

  const keyStats = ["Ball Possession","Total Shots","Shots on Goal","Passes","Fouls","Yellow Cards","Corners"];
  const rows = keyStats.map((key) => {
    const home = homeStats.find((s) => s.type === key)?.value ?? "—";
    const away = awayStats.find((s) => s.type === key)?.value ?? "—";
    return { key, home, away };
  });

  return (
    <div className="glass overflow-hidden">
      <div className="px-4 py-2.5 border-b border-white/[0.06] grid grid-cols-3 text-xs font-mono text-chalk-600 uppercase tracking-wider">
        <span className="text-left">{homeTeam?.name?.substring(0, 12)}</span>
        <span className="text-center">Stat</span>
        <span className="text-right">{awayTeam?.name?.substring(0, 12)}</span>
      </div>
      {rows.map(({ key, home, away }) => {
        const hNum = parseFloat(String(home).replace("%", "")) || 0;
        const aNum = parseFloat(String(away).replace("%", "")) || 0;
        const total = hNum + aNum || 1;
        const hPct = (hNum / total) * 100;
        return (
          <div key={key} className="px-4 py-3 border-b border-white/[0.04]">
            <div className="grid grid-cols-3 items-center mb-2">
              <span className="text-white text-sm font-mono">{home}</span>
              <span className="text-center text-chalk-600 text-xs">{key}</span>
              <span className="text-white text-sm font-mono text-right">{away}</span>
            </div>
            {hNum + aNum > 0 && (
              <div className="h-1 bg-white/[0.05] rounded-full overflow-hidden flex">
                <div className="h-full bg-grass-500 transition-all" style={{ width: `${hPct}%` }} />
                <div className="h-full bg-blue-500 flex-1" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Events Tab ────────────────────────────────────────────────
function EventsTab({ events }) {
  if (!events || events.length === 0) return <div className="text-center py-12 text-chalk-400">No events yet.</div>;

  const iconFor = (type, detail) => {
    if (type === "Goal") return "⚽";
    if (type === "Card" && detail?.includes("Yellow")) return "🟨";
    if (type === "Card") return "🟥";
    if (type === "subst") return "🔄";
    return "📌";
  };

  return (
    <div className="space-y-2">
      {events.map((e, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.02 }}
          className="glass flex items-center gap-3 px-4 py-2.5"
        >
          <span className="text-chalk-600 font-mono text-xs w-8">{e.time?.elapsed}'</span>
          <span className="text-lg">{iconFor(e.type, e.detail)}</span>
          <div className="flex-1">
            <p className="text-white text-sm">{e.player?.name}</p>
            {e.assist?.name && (
              <p className="text-chalk-600 text-xs">Assist: {e.assist.name}</p>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            {e.team?.logo && <img src={e.team.logo} alt="" className="w-4 h-4 object-contain" />}
            <span className="text-chalk-400 text-xs truncate max-w-[80px]">{e.team?.name}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

// ── Lineups Tab ───────────────────────────────────────────────
function LineupsTab({ lineups }) {
  if (!lineups || lineups.length === 0) return <div className="text-center py-12 text-chalk-400">Lineups not available yet.</div>;

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {lineups.map((lineup) => (
        <div key={lineup.team.id} className="glass p-4">
          <div className="flex items-center gap-2 mb-4">
            {lineup.team.logo && <img src={lineup.team.logo} alt="" className="w-6 h-6 object-contain" />}
            <p className="text-white font-semibold">{lineup.team.name}</p>
            <span className="ml-auto text-chalk-600 text-xs font-mono">{lineup.formation}</span>
          </div>

          {lineup.startXI?.map((entry) => (
            <div key={entry.player.id} className="flex items-center gap-2 py-1.5 border-b border-white/[0.04]">
              <span className="text-chalk-600 font-mono text-xs w-5">{entry.player.number}</span>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(entry.player.name + " footballer")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white text-sm hover:text-grass-400 transition-colors flex-1 truncate"
              >
                {entry.player.name}
              </a>
              <span className="text-chalk-600 text-xs">{entry.player.pos}</span>
            </div>
          ))}

          {lineup.substitutes?.length > 0 && (
            <>
              <p className="text-chalk-600 text-xs font-mono uppercase mt-3 mb-2">Substitutes</p>
              {lineup.substitutes.slice(0, 7).map((entry) => (
                <div key={entry.player.id} className="flex items-center gap-2 py-1">
                  <span className="text-chalk-700 font-mono text-xs w-5">{entry.player.number}</span>
                  <span className="text-chalk-500 text-sm flex-1 truncate">{entry.player.name}</span>
                  <span className="text-chalk-700 text-xs">{entry.player.pos}</span>
                </div>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
