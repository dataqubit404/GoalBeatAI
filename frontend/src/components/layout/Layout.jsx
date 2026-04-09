// GoalBeat AI — Layout
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Trophy, GitCompare, Users, Menu, X,
  Bell, Search, ChevronRight, Star, Zap, User, LogOut, Settings
} from "lucide-react";
import { useStore } from "../../store/useStore";
import { useSearch } from "../../hooks";
import NotificationPanel from "../features/NotificationPanel";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const NAV_LINKS = [
  { to: "/",           label: "Home",        icon: Zap },
  { to: "/leagues",    label: "Leagues",     icon: Trophy },
  { to: "/compare",    label: "Compare",     icon: GitCompare },
  { to: "/dashboard",  label: "Dashboard",   icon: LayoutDashboard },
  { to: "/squad-builder", label: "Squad",    icon: Users },
];

export default function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { notifications, user, logout, checkAuth, authLoading } = useStore();
  const unread = notifications.filter((n) => !n.read).length;
  const { query, setQuery, results, loading } = useSearch();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);

  // Initial auth check
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Close menus on outside click
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Navbar ── */}
      <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-pitch-950/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 mr-8 shrink-0">
            <div className="w-10 h-10 bg-white flex items-center justify-center">
              <span className="text-pitch-950 font-matchday text-xl">CR7</span>
            </div>
            <span className="text-matchday text-2xl tracking-tighter text-white hidden sm:block">
              GOALBEAT<span className="text-grass-500">AI</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1">
            {NAV_LINKS.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  location.pathname === to
                    ? "bg-white/[0.08] text-white"
                    : "text-chalk-400 hover:text-white hover:bg-white/[0.04]"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 ml-auto">
            {/* Search */}
            <div ref={searchRef} className="relative">
              <button
                onClick={() => setSearchOpen((v) => !v)}
                className="p-2 rounded-lg text-chalk-400 hover:text-white hover:bg-white/[0.06] transition-colors"
              >
                <Search size={16} />
              </button>

              <AnimatePresence>
                {searchOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-12 w-80 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <input
                        autoFocus
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search leagues, clubs..."
                        className="input-field w-full text-sm"
                      />
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {loading && (
                        <div className="p-4 text-center text-chalk-600 text-sm">Searching...</div>
                      )}
                      {results && (
                        <>
                          {results.leagues?.length > 0 && (
                            <div>
                              <p className="px-4 py-2 text-xs text-chalk-600 font-mono uppercase tracking-wider">Leagues</p>
                              {results.leagues.slice(0, 5).map((l) => (
                                <button
                                  key={l.league.id}
                                  onClick={() => { navigate(`/league/${l.league.id}`); setSearchOpen(false); }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
                                >
                                  {l.league.logo && (
                                    <img src={l.league.logo} alt="" className="w-5 h-5 object-contain" />
                                  )}
                                  <span className="text-sm text-white">{l.league.name}</span>
                                  <span className="ml-auto text-xs text-chalk-600">{l.country?.name}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {results.teams?.length > 0 && (
                            <div>
                              <p className="px-4 py-2 text-xs text-chalk-600 font-mono uppercase tracking-wider">Clubs</p>
                              {results.teams.slice(0, 5).map((t) => (
                                <button
                                  key={t.team.id}
                                  onClick={() => { navigate(`/club/${t.team.id}`); setSearchOpen(false); }}
                                  className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/[0.04] transition-colors text-left"
                                >
                                  {t.team.logo && (
                                    <img src={t.team.logo} alt="" className="w-5 h-5 object-contain" />
                                  )}
                                  <span className="text-sm text-white">{t.team.name}</span>
                                  <span className="ml-auto text-xs text-chalk-600">{t.team.country}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {results.leagues?.length === 0 && results.teams?.length === 0 && (
                            <p className="p-4 text-sm text-chalk-600 text-center">No results for "{query}"</p>
                          )}
                        </>
                      )}
                      {!loading && !results && query.length === 0 && (
                        <div className="p-4 text-sm text-chalk-600 text-center">Type to search...</div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((v) => !v)}
                className="p-2 rounded-lg text-chalk-400 hover:text-white hover:bg-white/[0.06] transition-colors relative"
              >
                <Bell size={16} />
                {unread > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-grass-500 rounded-full" />
                )}
              </button>
              <AnimatePresence>
                {notifOpen && <NotificationPanel onClose={() => setNotifOpen(false)} />}
              </AnimatePresence>
            </div>

            {/* User Profile / Login */}
            <div className="relative ml-1" ref={userMenuRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setUserMenuOpen((v) => !v)}
                    className="flex items-center gap-2 p-1 pl-1 pr-2 rounded-full bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] transition-all group"
                  >
                    <div className="w-7 h-7 rounded-full bg-grass-500 flex items-center justify-center text-pitch-950 text-xs font-bold uppercase">
                      {user.username.charAt(0)}
                    </div>
                    <span className="text-sm text-chalk-100 font-medium hidden sm:block">{user.username}</span>
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-12 w-56 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl py-1.5"
                      >
                        <div className="px-4 py-2 mb-1 border-b border-white/[0.06]">
                          <p className="text-xs font-mono text-chalk-600 uppercase tracking-widest">Account</p>
                          <p className="text-sm text-white font-medium truncate">{user.email}</p>
                        </div>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-colors text-sm text-chalk-100">
                          <User size={16} className="text-chalk-600" /> My Profile
                        </button>
                        <button className="w-full flex items-center gap-3 px-4 py-2 hover:bg-white/[0.04] transition-colors text-sm text-chalk-100">
                          <Settings size={16} className="text-chalk-600" /> Settings
                        </button>
                        <div className="h-px bg-white/[0.06] my-1" />
                        <button
                          onClick={() => logout()}
                          className="w-full flex items-center gap-3 px-4 py-2 hover:bg-red-500/10 transition-colors text-sm text-red-400"
                        >
                          <LogOut size={16} /> Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className="text-sm font-medium text-chalk-400 hover:text-white transition-colors px-3 py-1.5">
                    Sign In
                  </Link>
                  <Link to="/register" className="btn-primary h-8 px-3 text-xs">
                    Get Started
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu */}
            <button
              className="p-2 rounded-lg text-chalk-400 hover:text-white md:hidden transition-colors"
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-white/[0.06] md:hidden"
            >
              <div className="px-4 py-3 flex flex-col gap-1">
                {NAV_LINKS.map(({ to, label, icon: Icon }) => (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      location.pathname === to
                        ? "bg-white/[0.08] text-white"
                        : "text-chalk-400 hover:text-white hover:bg-white/[0.04]"
                    }`}
                  >
                    <Icon size={16} />
                    <span className="text-bulky tracking-tight">{label}</span>
                    <ChevronRight size={14} className="ml-auto opacity-30" />
                  </Link>
                ))}
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* ── Main ── */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.05] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-grass-500 flex items-center justify-center">
              <span className="text-pitch-950 font-display text-xs">CR7</span>
            </div>
            <span className="text-chalk-600 text-sm">GoalBeat AI</span>
          </div>
          <p className="text-chalk-600 text-xs text-center">
            Powered by API-Football · Siuuuuuuu
          </p>
          <p className="text-chalk-600 text-xs">© 2025 GoalBeat AI</p>
        </div>
      </footer>
    </div>
  );
}
