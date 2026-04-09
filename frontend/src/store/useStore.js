import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

// Set initial axios token if present
const initialToken = localStorage.getItem("goalbeat_token");
if (initialToken) {
  axios.defaults.headers.common["Authorization"] = `Bearer ${initialToken}`;
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ── Authentication ────────────────────────────────────
      user: null,
      token: initialToken,
      authLoading: !!initialToken,

      setAuth: (user, token) => {
        if (token) {
          localStorage.setItem("goalbeat_token", token);
          axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        } else {
          localStorage.removeItem("goalbeat_token");
          delete axios.defaults.headers.common["Authorization"];
        }
        set({ user, token, authLoading: false });
      },

      logout: () => {
        localStorage.removeItem("goalbeat_token");
        delete axios.defaults.headers.common["Authorization"];
        set({ user: null, token: null, favoriteLeagues: [], favoriteClubs: [] });
      },

      checkAuth: async () => {
        const token = get().token;
        if (!token) {
          set({ authLoading: false });
          return;
        }
        try {
          const res = await axios.get(`${API_URL}/auth/me`);
          set({ user: res.data, authLoading: false });
        } catch (err) {
          get().logout();
          set({ authLoading: false });
        }
      },

      // ── Favorites ─────────────────────────────────────────
      favoriteLeagues: [],
      favoriteClubs: [],

      addFavoriteLeague: (league) => {
        const exists = get().favoriteLeagues.find((l) => l.id === league.id);
        if (!exists) set((s) => ({ favoriteLeagues: [...s.favoriteLeagues, league] }));
      },
      removeFavoriteLeague: (id) =>
        set((s) => ({ favoriteLeagues: s.favoriteLeagues.filter((l) => l.id !== id) })),
      isFavoriteLeague: (id) => get().favoriteLeagues.some((l) => l.id === id),

      addFavoriteClub: (club) => {
        const exists = get().favoriteClubs.find((c) => c.id === club.id);
        if (!exists) set((s) => ({ favoriteClubs: [...s.favoriteClubs, club] }));
      },
      removeFavoriteClub: (id) =>
        set((s) => ({ favoriteClubs: s.favoriteClubs.filter((c) => c.id !== id) })),
      isFavoriteClub: (id) => get().favoriteClubs.some((c) => c.id === id),

      // ── Notifications ─────────────────────────────────────
      notifications: [],
      addNotification: (n) =>
        set((s) => ({ notifications: [{ ...n, id: Date.now(), read: false }, ...s.notifications.slice(0, 49)] })),
      markAllRead: () =>
        set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      // ── Compare Selection ─────────────────────────────────
      compareLeagues: [], // max 3 league IDs
      addCompareLeague: (id) => {
        const cur = get().compareLeagues;
        if (cur.includes(id)) return;
        if (cur.length >= 3) return;
        set({ compareLeagues: [...cur, id] });
      },
      removeCompareLeague: (id) =>
        set((s) => ({ compareLeagues: s.compareLeagues.filter((l) => l !== id) })),
      clearCompare: () => set({ compareLeagues: [] }),

      // ── UI State ──────────────────────────────────────────
      sidebarOpen: false,
      setSidebarOpen: (v) => set({ sidebarOpen: v }),

      // ── Current league/club context ───────────────────────
      activeLeague: null,
      setActiveLeague: (l) => set({ activeLeague: l }),
      activeClub: null,
      setActiveClub: (c) => set({ activeClub: c }),
    }),
    {
      name: "goalbeat-storage",
      partialize: (s) => ({
        favoriteLeagues: s.favoriteLeagues,
        favoriteClubs: s.favoriteClubs,
        user: s.user,
        token: s.token,
      }),
    }
  )
);
