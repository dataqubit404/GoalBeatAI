// GoalBeat AI — League Dashboard Page
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Star, GitCompare, Trophy, Calendar, Users, TrendingUp, RefreshCw } from "lucide-react";
import { LEAGUE_BY_ID } from "../../lib/constants";
import { useStore } from "../../store/useStore";
import { footballAPI } from "../../lib/api";
import StandingsTable from "../features/StandingsTable";
import FixturesList from "../features/FixturesList";
import TopScorers from "../features/TopScorers";
import LoadingSkeleton from "../ui/LoadingSkeleton";

const TABS = [
  { id: "standings", label: "Standings", icon: Trophy },
  { id: "fixtures",  label: "Fixtures",  icon: Calendar },
  { id: "scorers",   label: "Top Scorers", icon: TrendingUp },
  { id: "squad",     label: "Teams",     icon: Users },
];

export default function LeagueDashboardPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const leagueId = parseInt(id);
  const meta = LEAGUE_BY_ID[leagueId];

  const [tab, setTab] = useState("standings");
  const [standings, setStandings] = useState(null);
  const [fixtures, setFixtures] = useState(null);
  const [scorers, setScorers] = useState(null);
  const [leagueInfo, setLeagueInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const { addFavoriteLeague, removeFavoriteLeague, isFavoriteLeague, addCompareLeague, compareLeagues } = useStore();
  const isFav = isFavoriteLeague(leagueId);
  const inCompare = compareLeagues.includes(leagueId);

  const fetchData = async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [infoRes, standingsRes, fixturesRes, scorersRes] = await Promise.allSettled([
        footballAPI.getLeagueInfo(leagueId),
        footballAPI.getLeagueStandings(leagueId),
        footballAPI.getNextFixtures(leagueId, 10),
        footballAPI.getLeagueScorers(leagueId),
      ]);

      if (infoRes.status === "fulfilled") setLeagueInfo(infoRes.value?.response?.[0]);
      if (standingsRes.status === "fulfilled") {
        setStandings(standingsRes.value?.response?.[0]?.league?.standings?.[0] || []);
      }
      if (fixturesRes.status === "fulfilled") {
        setFixtures(fixturesRes.value?.response || []);
      }
      if (scorersRes.status === "fulfilled") {
        setScorers(scorersRes.value?.response || []);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { fetchData(); }, [leagueId]);

  const toggleFav = () => {
    if (isFav) {
      removeFavoriteLeague(leagueId);
    } else {
      addFavoriteLeague({ id: leagueId, name: meta?.name || "League", logo: meta?.logo });
    }
  };

  const toggleCompare = () => {
    if (inCompare) {
      useStore.getState().removeCompareLeague(leagueId);
    } else {
      addCompareLeague(leagueId);
    }
  };

  const leagueName = leagueInfo?.league?.name || meta?.name || `League ${id}`;
  const leagueLogo = leagueInfo?.league?.logo;
  const leagueCountry = leagueInfo?.country?.name || meta?.country;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Back */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-chalk-600 hover:text-white text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> All Leagues
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start gap-4 mb-8">
        <div className="flex items-center gap-4 flex-1">
          {leagueLogo ? (
            <img src={leagueLogo} alt={leagueName} className="w-14 h-14 object-contain" />
          ) : meta?.logo?.startsWith("http") ? (
            <img src={meta.logo} alt={leagueName} className="w-14 h-14 object-contain" />
          ) : (
            <div className="w-14 h-14 rounded-2xl bg-white/[0.05] flex items-center justify-center text-3xl">
              {meta?.logo || "⚽"}
            </div>
          )}
          <div>
            <h1 className="font-display text-4xl text-white tracking-wide">{leagueName}</h1>
            <div className="flex items-center gap-2 mt-1">
              {leagueCountry && (
                <span className="text-chalk-400 text-sm">{leagueCountry}</span>
              )}
              {meta?.type && (
                <span className={`badge text-xs ${
                  meta.type === "cup" ? "badge-amber" : meta.type === "tournament" ? "badge-blue" : "badge-green"
                }`}>
                  {meta.type.charAt(0).toUpperCase() + meta.type.slice(1)}
                </span>
              )}
              {meta?.founded && (
                <span className="text-chalk-600 text-xs font-mono">est. {meta.founded}</span>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => fetchData(true)}
            className={`p-2 rounded-lg border border-white/10 text-chalk-400 hover:text-white transition-colors ${refreshing ? "animate-spin" : ""}`}
          >
            <RefreshCw size={15} />
          </button>
          <button
            onClick={toggleCompare}
            className={`btn-ghost text-sm gap-1.5 ${inCompare ? "border-grass-500/40 text-grass-400" : ""}`}
          >
            <GitCompare size={14} />
            {inCompare ? "In Compare" : "Compare"}
          </button>
          <button
            onClick={toggleFav}
            className={`btn-ghost text-sm gap-1.5 ${isFav ? "border-amber-400/40 text-amber-300" : ""}`}
          >
            <Star size={14} fill={isFav ? "currentColor" : "none"} />
            {isFav ? "Saved" : "Save"}
          </button>
        </div>
      </div>

      {/* League Meta Cards */}
      {meta && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          {[
            { label: "Teams", value: meta.teams || "—" },
            { label: "Founded", value: meta.founded || "—" },
            { label: "Country", value: meta.country },
            { label: "Format", value: meta.type === "cup" ? "Knockout" : "Round-Robin" },
          ].map((item) => (
            <div key={item.label} className="glass p-4">
              <p className="text-chalk-600 text-xs font-mono uppercase tracking-wider mb-1">{item.label}</p>
              <p className="text-white font-semibold">{item.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-white/[0.06] mb-6 overflow-x-auto">
        {TABS.map(({ id: tabId, label, icon: Icon }) => (
          <button
            key={tabId}
            onClick={() => setTab(tabId)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-colors whitespace-nowrap relative ${
              tab === tabId ? "text-white" : "text-chalk-400 hover:text-white"
            }`}
          >
            <Icon size={14} />
            {label}
            {tab === tabId && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-px bg-grass-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSkeleton rows={12} />
      ) : (
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {tab === "standings" && (
            <StandingsTable standings={standings} leagueId={leagueId} />
          )}
          {tab === "fixtures" && (
            <FixturesList fixtures={fixtures} leagueId={leagueId} />
          )}
          {tab === "scorers" && (
            <TopScorers scorers={scorers} />
          )}
          {tab === "squad" && (
            <TeamsGrid standings={standings} />
          )}
        </motion.div>
      )}

      {/* Compare CTA */}
      {compareLeagues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 glass border border-grass-500/30 p-4 rounded-xl shadow-2xl glow-green"
        >
          <p className="text-sm text-white mb-2">
            {compareLeagues.length} league{compareLeagues.length > 1 ? "s" : ""} selected for comparison
          </p>
          <Link to="/compare" className="btn-primary text-sm w-full justify-center">
            Compare Now <ArrowLeft size={14} className="rotate-180" />
          </Link>
        </motion.div>
      )}
    </div>
  );
}

function TeamsGrid({ standings }) {
  if (!standings || standings.length === 0) {
    return <p className="text-chalk-600 text-sm text-center py-12">Team data not available.</p>;
  }
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {standings.map((entry) => (
        <Link
          key={entry.team.id}
          to={`/club/${entry.team.id}`}
          className="glass-hover flex items-center gap-3 p-3 group"
        >
          {entry.team.logo && (
            <img src={entry.team.logo} alt={entry.team.name} className="w-9 h-9 object-contain" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium group-hover:text-grass-400 transition-colors truncate">
              {entry.team.name}
            </p>
            <p className="text-chalk-600 text-xs">{entry.points} pts · {entry.all?.win}W {entry.all?.draw}D {entry.all?.lose}L</p>
          </div>
          <span className="text-chalk-600 text-lg font-display">{entry.rank}</span>
        </Link>
      ))}
    </div>
  );
}
