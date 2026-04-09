// GoalBeat AI — Club Page
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, ExternalLink, MapPin, Calendar, Users } from "lucide-react";
import { footballAPI } from "../../lib/api";
import { useStore } from "../../store/useStore";
import { CLUB_LEGENDS } from "../../lib/constants";
import LoadingSkeleton from "../ui/LoadingSkeleton";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const TABS = ["Overview", "Squad", "Stats", "Form", "Legends"];

export default function ClubPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const teamId = parseInt(id);
  const [tab, setTab] = useState("Overview");
  const [clubData, setClubData] = useState(null);
  const [players, setPlayers] = useState([]);
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addFavoriteClub, removeFavoriteClub, isFavoriteClub } = useStore();
  const isFav = isFavoriteClub(teamId);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [clubRes, playerRes, fixturesRes] = await Promise.allSettled([
          footballAPI.getClub(teamId),
          footballAPI.getClubPlayers(teamId),
          footballAPI.getClubFixtures(teamId, 5),
        ]);
        if (clubRes.status === "fulfilled") setClubData(clubRes.value?.response?.[0]);
        if (playerRes.status === "fulfilled") setPlayers(playerRes.value?.response || []);
        if (fixturesRes.status === "fulfilled") setFixtures(fixturesRes.value?.response || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [teamId]);

  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><LoadingSkeleton rows={10} /></div>;

  const team = clubData?.team;
  const venue = clubData?.venue;
  const legends = CLUB_LEGENDS[teamId] || [];

  // Last 5 form
  const form = fixtures.map((f) => {
    const isHome = f.teams?.home?.id === teamId;
    const winner = f.teams?.home?.winner ? "home" : f.teams?.away?.winner ? "away" : "draw";
    const isWin = (isHome && winner === "home") || (!isHome && winner === "away");
    return isWin ? "W" : winner === "draw" ? "D" : "L";
  });

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-chalk-600 hover:text-white text-sm mb-6 transition-colors">
        <ArrowLeft size={14} /> Back
      </button>

      {/* Club Header */}
      <div className="glass p-6 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {team?.logo && (
            <img src={team.logo} alt={team.name} className="w-20 h-20 object-contain" />
          )}
          <div className="flex-1">
            <h1 className="text-matchday text-7xl text-white leading-none">{team?.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {team?.country && (
                <span className="flex items-center gap-1 text-chalk-400 text-sm">
                  <MapPin size={12} /> {team.country}
                </span>
              )}
              {team?.founded && (
                <span className="flex items-center gap-1 text-chalk-400 text-sm">
                  <Calendar size={12} /> Founded {team.founded}
                </span>
              )}
              {venue?.name && (
                <span className="flex items-center gap-1 text-chalk-400 text-sm">
                  🏟 {venue.name}
                  {venue?.capacity && ` · ${venue.capacity.toLocaleString()}`}
                </span>
              )}
            </div>
            {/* Last 5 form */}
            <div className="flex items-center gap-1 mt-3">
              <span className="text-chalk-600 text-xs mr-1">Last 5:</span>
              {form.length > 0 ? form.map((f, i) => (
                <span key={i} className={f === "W" ? "form-w" : f === "D" ? "form-d" : "form-l"}>{f}</span>
              )) : <span className="text-chalk-600 text-xs">No data</span>}
            </div>
          </div>
          <button
            onClick={() => isFav ? removeFavoriteClub(teamId) : addFavoriteClub({ id: teamId, name: team?.name, logo: team?.logo })}
            className={`btn-ghost ${isFav ? "border-amber-400/40 text-amber-300" : ""}`}
          >
            <Star size={14} fill={isFav ? "currentColor" : "none"} />
            {isFav ? "Saved" : "Save Club"}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] mb-6 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap relative ${
              tab === t ? "text-white" : "text-chalk-400 hover:text-white"
            }`}
          >
            {t}
            {tab === t && (
              <motion.div layoutId="club-tab" className="absolute bottom-0 left-0 right-0 h-px bg-grass-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}>
        {tab === "Overview" && <ClubOverview team={team} venue={venue} fixtures={fixtures} teamId={teamId} />}
        {tab === "Squad" && <SquadTab players={players} />}
        {tab === "Stats" && <StatsTab fixtures={fixtures} teamId={teamId} />}
        {tab === "Form" && <FormTab fixtures={fixtures} teamId={teamId} />}
        {tab === "Legends" && <LegendsTab legends={legends} teamName={team?.name} />}
      </motion.div>
    </div>
  );
}

// ── Overview Tab ─────────────────────────────────────────────
function ClubOverview({ team, venue, fixtures, teamId }) {
  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        {venue && (
          <div className="glass p-4">
            <p className="section-eyebrow mb-3">Stadium</p>
            <p className="text-white font-semibold">{venue.name}</p>
            <p className="text-chalk-400 text-sm mt-1">{venue.city}, {venue.country}</p>
            {venue.capacity && <p className="text-chalk-600 text-sm mt-1">Capacity: {venue.capacity.toLocaleString()}</p>}
            {venue.surface && <p className="text-chalk-600 text-sm">Surface: {venue.surface}</p>}
          </div>
        )}
        <div className="glass p-4">
          <p className="section-eyebrow mb-3">Recent Results</p>
          <div className="space-y-2">
            {fixtures.slice(0, 4).map((f) => {
              const isHome = f.teams?.home?.id === teamId;
              const opponent = isHome ? f.teams?.away : f.teams?.home;
              const score = `${f.goals?.home ?? "–"} – ${f.goals?.away ?? "–"}`;
              return (
                <Link key={f.fixture.id} to={`/match/${f.fixture.id}`} className="flex items-center gap-2 text-sm hover:bg-white/[0.03] p-1.5 rounded transition-colors">
                  <span className="text-chalk-600 text-xs w-8">{isHome ? "H" : "A"}</span>
                  {opponent?.logo && <img src={opponent.logo} alt="" className="w-4 h-4 object-contain" />}
                  <span className="text-chalk-400 flex-1 truncate">{opponent?.name}</span>
                  <span className="font-mono text-white text-xs">{score}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Squad Tab ─────────────────────────────────────────────────
function SquadTab({ players }) {
  const positions = ["Goalkeeper", "Defender", "Midfielder", "Attacker"];
  const grouped = Object.fromEntries(positions.map((p) => [p, []]));

  players.forEach((entry) => {
    entry.players?.forEach((pl) => {
      const pos = pl.position;
      if (grouped[pos]) grouped[pos].push(pl);
    });
  });

  return (
    <div className="space-y-6">
      {positions.map((pos) => (
        grouped[pos].length > 0 && (
          <div key={pos}>
            <p className="section-eyebrow mb-3">{pos}s</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {grouped[pos].map((pl) => (
                <a
                  key={pl.id}
                  href={`https://www.google.com/search?q=${encodeURIComponent(pl.name + " footballer")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass-hover flex items-center gap-3 p-3 group"
                >
                  {pl.photo ? (
                    <img src={pl.photo} alt={pl.name} className="w-9 h-9 rounded-full object-cover bg-white/[0.05] shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-white/[0.05] flex items-center justify-center text-sm text-chalk-600 shrink-0">
                      {pl.number || "–"}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm group-hover:text-grass-400 transition-colors truncate flex items-center gap-1">
                      {pl.name}
                      <ExternalLink size={10} className="opacity-0 group-hover:opacity-40 shrink-0" />
                    </p>
                    <p className="text-chalk-600 text-xs">{pl.nationality} · #{pl.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )
      ))}
      {players.length === 0 && <p className="text-chalk-600 text-center py-12">Squad data not available.</p>}
    </div>
  );
}

// ── Stats Tab ─────────────────────────────────────────────────
function StatsTab({ fixtures, teamId }) {
  const chartData = fixtures.map((f) => {
    const isHome = f.teams?.home?.id === teamId;
    return {
      match: (isHome ? f.teams.away.name : f.teams.home.name).substring(0, 8),
      GF: isHome ? (f.goals?.home ?? 0) : (f.goals?.away ?? 0),
      GA: isHome ? (f.goals?.away ?? 0) : (f.goals?.home ?? 0),
    };
  }).reverse();

  return (
    <div className="space-y-6">
      <div className="glass p-5">
        <p className="section-eyebrow mb-4">Goals — Last 5 Matches</p>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={chartData} barGap={4}>
            <XAxis dataKey="match" tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: "#475569", fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: "#0a1520", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: "#94a3b8" }}
            />
            <Bar dataKey="GF" name="Goals For" fill="#22c55e" radius={[3, 3, 0, 0]} />
            <Bar dataKey="GA" name="Goals Against" fill="#ef4444" radius={[3, 3, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

// ── Form Tab ─────────────────────────────────────────────────
function FormTab({ fixtures, teamId }) {
  return (
    <div className="space-y-3">
      {fixtures.map((f) => {
        const isHome = f.teams?.home?.id === teamId;
        const opponent = isHome ? f.teams?.away : f.teams?.home;
        const goalsFor = isHome ? f.goals?.home : f.goals?.away;
        const goalsAgainst = isHome ? f.goals?.away : f.goals?.home;
        const winner = f.teams?.home?.winner ? "home" : f.teams?.away?.winner ? "away" : "draw";
        const result = (isHome && winner === "home") || (!isHome && winner === "away") ? "W" : winner === "draw" ? "D" : "L";

        return (
          <Link key={f.fixture.id} to={`/match/${f.fixture.id}`} className="glass-hover flex items-center gap-4 p-4">
            <span className={result === "W" ? "form-w text-sm" : result === "D" ? "form-d text-sm" : "form-l text-sm"}>{result}</span>
            <span className="text-chalk-600 text-xs w-8">{isHome ? "vs" : "@"}</span>
            {opponent?.logo && <img src={opponent.logo} alt="" className="w-5 h-5 object-contain" />}
            <span className="text-white text-sm flex-1 truncate">{opponent?.name}</span>
            <span className="font-mono text-white text-sm">{goalsFor} – {goalsAgainst}</span>
            <span className="text-chalk-600 text-xs hidden sm:block">
              {new Date(f.fixture.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
          </Link>
        );
      })}
      {fixtures.length === 0 && <p className="text-chalk-600 text-center py-12">No recent matches found.</p>}
    </div>
  );
}

// ── Legends Tab ───────────────────────────────────────────────
function LegendsTab({ legends, teamName }) {
  if (legends.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-4xl mb-3">🏆</p>
        <p className="text-chalk-400">Legends data not yet added for this club.</p>
        <p className="text-chalk-600 text-sm mt-2">
          You can add legends to{" "}
          <code className="bg-white/[0.05] px-1 rounded text-xs">src/lib/constants.js</code>
        </p>
      </div>
    );
  }
  return (
    <div className="grid sm:grid-cols-2 gap-3">
      {legends.map((legend) => (
        <a
          key={legend.name}
          href={`https://www.google.com/search?q=${encodeURIComponent(legend.name + " footballer " + teamName)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="glass-hover flex items-center gap-4 p-4 group"
        >
          <div className="w-10 h-10 rounded-full bg-amber-400/10 flex items-center justify-center text-amber-400 shrink-0">
            <span className="text-xl">⭐</span>
          </div>
          <div className="flex-1">
            <p className="text-white font-medium group-hover:text-grass-400 transition-colors flex items-center gap-1">
              {legend.name}
              <ExternalLink size={11} className="opacity-0 group-hover:opacity-50" />
            </p>
            <p className="text-chalk-600 text-xs mt-0.5">{legend.years} · {legend.goals} goals</p>
          </div>
        </a>
      ))}
    </div>
  );
}
