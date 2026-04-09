// GoalBeat AI — Personal Dashboard Page
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star, Trophy, Calendar, TrendingUp, ArrowRight, Zap, Bell } from "lucide-react";
import { useStore } from "../../store/useStore";
import { footballAPI } from "../../lib/api";
import { LEAGUE_BY_ID } from "../../lib/constants";
import LoadingSkeleton from "../ui/LoadingSkeleton";
import PredictionModal from "../ui/PredictionModal";

// ── Widget wrapper ────────────────────────────────────────────
function Widget({ title, icon: Icon, children, delay = 0, action }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="glass"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          {Icon && <Icon size={14} className="text-grass-400" />}
          <span className="text-white text-sm font-medium">{title}</span>
        </div>
        {action}
      </div>
      <div className="p-4">{children}</div>
    </motion.div>
  );
}

// ── Live ticker ───────────────────────────────────────────────
function LiveTicker({ matches }) {
  if (!matches || matches.length === 0) {
    return <p className="text-chalk-600 text-sm text-center py-4">No live matches right now.</p>;
  }
  return (
    <div className="space-y-2">
      {matches.slice(0, 5).map((m) => (
        <Link key={m.fixture.id} to={`/match/${m.fixture.id}`}
          className="flex items-center gap-3 p-2.5 hover:bg-white/[0.04] rounded-lg transition-colors">
          <span className="badge-red text-xs shrink-0 rounded-lg">
            <span className="live-dot" />{m.fixture?.status?.elapsed}'
          </span>
          <div className="flex items-center gap-1.5 flex-1 min-w-0">
            {m.teams?.home?.logo && <img src={m.teams.home.logo} alt="" className="w-4 h-4 object-contain" />}
            <span className="text-white text-xs truncate">{m.teams?.home?.name}</span>
          </div>
          <span className="font-mono text-white text-sm shrink-0">
            {m.goals?.home ?? 0}:{m.goals?.away ?? 0}
          </span>
          <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
            <span className="text-white text-xs truncate text-right">{m.teams?.away?.name}</span>
            {m.teams?.away?.logo && <img src={m.teams.away.logo} alt="" className="w-4 h-4 object-contain" />}
          </div>
        </Link>
      ))}
    </div>
  );
}

// ── Favorite leagues widget ───────────────────────────────────
function FavLeaguesWidget({ leagues }) {
  if (leagues.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-chalk-600 text-sm">No favourite leagues yet.</p>
        <Link to="/leagues" className="text-grass-500 text-sm hover:underline mt-1 block">
          Browse leagues →
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {leagues.map((l) => (
        <Link key={l.id} to={`/league/${l.id}`}
          className="flex items-center gap-3 p-2.5 hover:bg-white/[0.04] rounded-xl transition-colors group">
          <span className="w-8 h-8 flex items-center justify-center bg-white/[0.05] rounded-xl overflow-hidden shrink-0">
            {l.logo?.startsWith("http") ? (
              <img src={l.logo} alt="" className="w-6 h-6 object-contain" />
            ) : (
              <span className="text-xl">{l.logo || "⚽"}</span>
            )}
          </span>
          <span className="text-white text-sm group-hover:text-grass-400 transition-colors flex-1">{l.name}</span>
          <ArrowRight size={13} className="text-chalk-600 group-hover:text-grass-400 transition-colors" />
        </Link>
      ))}
    </div>
  );
}

// ── Favorite clubs widget ─────────────────────────────────────
function FavClubsWidget({ clubs }) {
  if (clubs.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-chalk-600 text-sm">No favourite clubs yet.</p>
        <Link to="/leagues" className="text-grass-500 text-sm hover:underline mt-1 block">
          Find clubs →
        </Link>
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {clubs.map((c) => (
        <Link key={c.id} to={`/club/${c.id}`}
          className="flex items-center gap-3 p-2.5 hover:bg-white/[0.04] rounded-lg transition-colors group">
          {c.logo ? (
            <img src={c.logo} alt={c.name} className="w-7 h-7 object-contain" />
          ) : (
            <div className="w-7 h-7 rounded-full bg-white/[0.06] flex items-center justify-center text-sm">{c.name?.[0]}</div>
          )}
          <span className="text-white text-sm group-hover:text-grass-400 transition-colors flex-1">{c.name}</span>
          <ArrowRight size={13} className="text-chalk-600 group-hover:text-grass-400 transition-colors" />
        </Link>
      ))}
    </div>
  );
}

// ── Upcoming from fav leagues ─────────────────────────────────
function UpcomingWidget({ leagueIds }) {
  const [fixtures, setFixtures] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!leagueIds.length) return;
    setLoading(true);
    Promise.allSettled(leagueIds.slice(0, 3).map((id) => footballAPI.getNextFixtures(id, 3)))
      .then((results) => {
        const all = results
          .filter((r) => r.status === "fulfilled")
          .flatMap((r) => r.value?.response || [])
          .sort((a, b) => new Date(a.fixture.date) - new Date(b.fixture.date));
        setFixtures(all.slice(0, 8));
      })
      .finally(() => setLoading(false));
  }, [leagueIds.join(",")]);

  if (!leagueIds.length) return <p className="text-chalk-600 text-sm text-center py-4">Save leagues to see upcoming matches.</p>;
  if (loading) return <LoadingSkeleton rows={4} />;

  return (
    <div className="space-y-1.5">
      {fixtures.map((f) => {
        const d = new Date(f.fixture.date);
        return (
          <button key={f.fixture.id} onClick={() => onSelect(f)}
            className="w-full h-auto text-left flex items-center gap-3 p-2.5 hover:bg-white/[0.04] rounded-xl transition-colors group">
            <span className="text-chalk-600 text-[10px] font-mono w-16 shrink-0 uppercase">
              {d.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
            </span>
            <div className="flex items-center gap-1.5 flex-1 min-w-0 justify-end">
              <span className="text-white text-xs truncate group-hover:text-grass-400 transition-colors">{f.teams?.home?.name}</span>
              {f.teams?.home?.logo && <img src={f.teams.home.logo} alt="" className="w-4 h-4 object-contain" />}
            </div>
            <span className="text-chalk-800 text-[10px] shrink-0 font-mono">VS</span>
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              {f.teams?.away?.logo && <img src={f.teams.away.logo} alt="" className="w-4 h-4 object-contain" />}
              <span className="text-white text-xs truncate group-hover:text-grass-400 transition-colors">{f.teams?.away?.name}</span>
            </div>
            <Zap size={11} className="text-chalk-800 group-hover:text-grass-400 transition-colors shrink-0" />
          </button>
        );
      })}
      {fixtures.length === 0 && <p className="text-chalk-600 text-sm text-center py-4">No upcoming fixtures found.</p>}
    </div>
  );
}

// ── Notifications widget ──────────────────────────────────────
function NotificationsWidget({ notifications, markAllRead }) {
  if (notifications.length === 0) {
    return <p className="text-chalk-600 text-sm text-center py-4">No notifications.</p>;
  }
  return (
    <div className="space-y-2">
      {notifications.slice(0, 6).map((n) => (
        <div key={n.id} className={`flex items-start gap-3 p-2.5 rounded-lg ${n.read ? "opacity-50" : "bg-white/[0.03]"}`}>
          <span className="text-lg shrink-0">{n.type === "goal" ? "⚽" : n.type === "result" ? "🏁" : "🔔"}</span>
          <div className="flex-1 min-w-0">
            <p className="text-white text-xs">{n.message}</p>
            <p className="text-chalk-600 text-xs mt-0.5">{new Date(n.id).toLocaleTimeString()}</p>
          </div>
          {!n.read && <div className="w-1.5 h-1.5 rounded-full bg-grass-500 shrink-0 mt-1" />}
        </div>
      ))}
    </div>
  );
}

// ── MAIN DASHBOARD ────────────────────────────────────────────
export default function DashboardPage() {
  const { favoriteLeagues, favoriteClubs, notifications, markAllRead } = useStore();
  const [liveMatches, setLiveMatches] = useState([]);
  const [liveLoading, setLiveLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const unread = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const fetchLive = async () => {
      try {
        const res = await footballAPI.getLiveMatches();
        setLiveMatches(res?.response || []);
      } finally {
        setLiveLoading(false);
      }
    };
    fetchLive();
    const interval = setInterval(fetchLive, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-10">
        <p className="section-eyebrow mb-2">Your Space</p>
        <h1 className="section-title">DASHBOARD</h1>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { label: "Saved Leagues", value: favoriteLeagues.length, icon: "🏆" },
          { label: "Saved Clubs", value: favoriteClubs.length, icon: "⭐" },
          { label: "Live Matches", value: liveMatches.length, icon: "⚽" },
          { label: "Notifications", value: unread, icon: "🔔" },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.07 }}
            className="glass p-4 text-center"
          >
            <p className="text-2xl mb-1">{stat.icon}</p>
            <p className="font-display text-3xl text-white">{stat.value}</p>
            <p className="text-chalk-600 text-xs mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main widgets grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Live Matches */}
        <Widget
          title="Live Matches"
          icon={Zap}
          delay={0.1}
          action={
            liveMatches.length > 0 && (
              <span className="badge-red text-xs">
                <span className="live-dot" /> {liveMatches.length} live
              </span>
            )
          }
        >
          {liveLoading ? <LoadingSkeleton rows={3} /> : <LiveTicker matches={liveMatches} />}
        </Widget>

        {/* Favourite Leagues */}
        <Widget
          title="Favourite Leagues"
          icon={Trophy}
          delay={0.15}
          action={
            <Link to="/leagues" className="text-grass-500 text-xs hover:underline">Browse</Link>
          }
        >
          <FavLeaguesWidget leagues={favoriteLeagues} />
        </Widget>

        {/* Favourite Clubs */}
        <Widget
          title="Favourite Clubs"
          icon={Star}
          delay={0.2}
          action={
            <Link to="/leagues" className="text-grass-500 text-xs hover:underline">Find clubs</Link>
          }
        >
          <FavClubsWidget clubs={favoriteClubs} />
        </Widget>

        {/* Upcoming from fav leagues */}
        <Widget
          title="Upcoming Matches"
          icon={Calendar}
          delay={0.25}
          action={
            <span className="text-chalk-600 text-xs">From saved leagues</span>
          }
        >
          <UpcomingWidget leagueIds={favoriteLeagues.map((l) => l.id)} onSelect={setSelectedFixture} />
        </Widget>

        {/* Notifications */}
        <Widget
          title="Notifications"
          icon={Bell}
          delay={0.3}
          action={
            unread > 0 && (
              <button onClick={markAllRead} className="text-grass-500 text-xs hover:underline">
                Mark all read
              </button>
            )
          }
        >
          <NotificationsWidget notifications={notifications} markAllRead={markAllRead} />
        </Widget>

        {/* Quick links */}
        <Widget title="Quick Actions" icon={TrendingUp} delay={0.35}>
          <div className="space-y-2">
            {[
              { to: "/leagues", label: "Browse All Leagues", icon: "🏆" },
              { to: "/compare", label: "Compare Leagues", icon: "📊" },
              { to: "/squad-builder", label: "Squad Builder", icon: "⚽" },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="flex items-center gap-3 p-2.5 hover:bg-white/[0.04] rounded-lg transition-colors group"
              >
                <span className="text-lg">{link.icon}</span>
                <span className="text-white text-sm group-hover:text-grass-400 transition-colors flex-1">{link.label}</span>
                <ArrowRight size={13} className="text-chalk-600 group-hover:text-grass-400 transition-colors" />
              </Link>
            ))}
          </div>
        </Widget>
      </div>

      {/* Prediction Overlay */}
      <PredictionModal
        fixture={selectedFixture}
        isOpen={!!selectedFixture}
        onClose={() => setSelectedFixture(null)}
      />
    </div>
  );
}
