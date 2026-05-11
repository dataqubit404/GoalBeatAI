// ============================================================
// GoalBeat AI — Socket.IO Client
// ============================================================
import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_API_URL || "http://localhost:3001";

// Remove /api if present in VITE_API_URL for socket connection
const cleanSocketUrl = SOCKET_URL.replace(/\/api$/, "");

export const socket = io(cleanSocketUrl, {
  autoConnect: false,
  transports: ["websocket"],
  withCredentials: true,
});

// Helper to subscribe to specific updates
export const subscribeToLeague = (leagueId) => {
  if (!socket.connected) socket.connect();
  socket.emit("subscribe:league", leagueId);
};

export const subscribeToMatch = (matchId) => {
  if (!socket.connected) socket.connect();
  socket.emit("subscribe:match", matchId);
};
