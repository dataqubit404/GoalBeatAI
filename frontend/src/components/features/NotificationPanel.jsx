// GoalBeat AI — Notification Panel
import { motion } from "framer-motion";
import { X, BellOff } from "lucide-react";
import { useStore } from "../../store/useStore";

export default function NotificationPanel({ onClose }) {
  const { notifications, markAllRead } = useStore();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ duration: 0.15 }}
      className="absolute right-0 top-12 w-80 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-2">
          <span className="text-white font-medium text-sm">Notifications</span>
          {unread > 0 && (
            <span className="badge-green text-xs">{unread} new</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-chalk-600 hover:text-white text-xs transition-colors"
            >
              Mark all read
            </button>
          )}
          <button onClick={onClose} className="text-chalk-600 hover:text-white transition-colors">
            <X size={14} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <BellOff size={24} className="text-chalk-700 mb-2" />
            <p className="text-chalk-600 text-sm">No notifications yet.</p>
            <p className="text-chalk-700 text-xs mt-1">
              Notifications appear when live matches update.
            </p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-4 py-3 border-b border-white/[0.04] last:border-0 transition-colors
                ${n.read ? "opacity-50" : "hover:bg-white/[0.03]"}`}
            >
              <span className="text-lg shrink-0 mt-0.5">
                {n.type === "goal" ? "⚽" : n.type === "result" ? "🏁" : n.type === "prediction" ? "🤖" : "🔔"}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs leading-relaxed">{n.message}</p>
                <p className="text-chalk-600 text-xs mt-1">
                  {new Date(n.id).toLocaleString("en-GB", {
                    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                  })}
                </p>
              </div>
              {!n.read && (
                <div className="w-1.5 h-1.5 rounded-full bg-grass-500 shrink-0 mt-1.5" />
              )}
            </div>
          ))
        )}
      </div>
    </motion.div>
  );
}
