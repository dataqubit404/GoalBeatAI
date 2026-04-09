// GoalBeat AI — Prediction Overlay Modal
import { motion, AnimatePresence } from "framer-motion";
import { X, Zap, Target, TrendingUp, Shield, HelpCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { footballAPI } from "../../lib/api";

export default function PredictionModal({ fixture, isOpen, onClose }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  // Mirror fixture state locally to ensure it persists during exit animations
  const [localFixture, setLocalFixture] = useState(null);

  useEffect(() => {
    if (fixture) {
      setLocalFixture(fixture);
      setLoading(true);
      setPrediction(null); // Reset for new match
      footballAPI.predictMatch(fixture.fixture.id)
        .then(res => {
          // Robust check for prediction structure
          if (res && (res.prediction || res.homeTeam)) {
            setPrediction(res);
          } else {
            setPrediction(null);
          }
        })
        .catch(() => setPrediction(null))
        .finally(() => setLoading(false));
    }
  }, [fixture]);

  const hasData = prediction && prediction.prediction;

  return (
    <AnimatePresence>
      {isOpen && localFixture && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-pitch-950/80 backdrop-blur-md"
          />

          {/* Modal content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-xl glass border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-white/[0.06] flex items-center justify-between bg-white/[0.02]">
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-grass-400" />
                <span className="text-white font-bold uppercase tracking-widest text-xs">Match Intelligence AI</span>
              </div>
              <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full transition-colors text-chalk-600 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Teams H2H style - Always Visible */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex-1 text-center group">
                  {localFixture.teams?.home?.logo && (
                    <img src={localFixture.teams.home.logo} className="w-16 h-16 object-contain mx-auto mb-3 grayscale group-hover:grayscale-0 transition-all" alt=""/>
                  )}
                  <p className="text-white font-display text-lg tracking-tight uppercase truncate px-2">
                    {localFixture.teams?.home?.name || "Home Team"}
                  </p>
                  <div className="flex justify-center gap-1 mt-2 min-h-[14px]">
                    {prediction?.homeTeam?.form?.map((f,i) => <span key={i} className={f==="W"?"form-w":f==="D"?"form-d":"form-l"}>{f}</span>)}
                  </div>
                </div>

                <div className="shrink-0 px-6 text-center">
                  <span className="text-chalk-800 font-mono text-sm block mb-1">VS</span>
                  <div className="badge-green px-2 py-0.5 text-[10px]">PREDICTING...</div>
                </div>

                <div className="flex-1 text-center group">
                  {localFixture.teams?.away?.logo && (
                    <img src={localFixture.teams.away.logo} className="w-16 h-16 object-contain mx-auto mb-3 grayscale group-hover:grayscale-0 transition-all" alt=""/>
                  )}
                  <p className="text-white font-display text-lg tracking-tight uppercase truncate px-2">
                    {localFixture.teams?.away?.name || "Away Team"}
                  </p>
                  <div className="flex justify-center gap-1 mt-2 min-h-[14px]">
                    {prediction?.awayTeam?.form?.map((f,i) => <span key={i} className={f==="W"?"form-w":f==="D"?"form-d":"form-l"}>{f}</span>)}
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="space-y-4 py-4">
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      animate={{ x: ["-100%", "100%"] }} 
                      transition={{ repeat: Infinity, duration: 1.5 }} 
                      className="absolute inset-0 bg-grass-500/20 w-1/3"
                    />
                  </div>
                  <div className="h-12 skeleton rounded-xl opacity-20"/>
                  <div className="h-12 skeleton rounded-xl opacity-10"/>
                </div>
              ) : hasData ? (
                <div className="space-y-6">
                  {/* Confidence */}
                  <div className="bg-white/[0.02] border border-white/5 p-4 rounded-xl flex items-center justify-between">
                    <div>
                      <p className="text-chalk-600 text-[10px] uppercase font-mono tracking-widest mb-1">AI Confidence</p>
                      <p className={`text-xl font-black ${prediction.prediction?.confidence === "High" ? "text-grass-400" : "text-amber-400"}`}>
                        {prediction.prediction?.confidence || "Medium"}
                      </p>
                    </div>
                    <TrendingUp className={prediction.prediction?.confidence === "High" ? "text-grass-400" : "text-amber-400"} size={28}/>
                  </div>

                  {/* Outcome Probabilities */}
                  <div className="space-y-4">
                    {[
                      { label: `${localFixture.teams?.home?.name || 'Home'} Win`, pct: prediction.prediction?.homeWin || 33, color: "bg-grass-500" },
                      { label: "Draw", pct: prediction.prediction?.draw || 34, color: "bg-amber-400" },
                      { label: `${localFixture.teams?.away?.name || 'Away'} Win`, pct: prediction.prediction?.awayWin || 33, color: "bg-blue-500" },
                    ].map((b) => (
                      <div key={b.label}>
                        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider mb-2">
                          <span className="text-chalk-400">{b.label}</span>
                          <span className="text-white">{b.pct}%</span>
                        </div>
                        <div className="h-2 bg-white/[0.05] rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${b.pct}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className={`h-full ${b.color} rounded-full glow-sm shadow-[0_0_10px_rgba(34,197,94,0.3)]`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Technical Stats */}
                  {prediction.prediction?.expectedGoals && (
                    <div className="grid grid-cols-2 gap-3 pt-6 border-t border-white/[0.06]">
                      <div className="flex items-center gap-3">
                        <Target size={16} className="text-chalk-600"/>
                        <div>
                          <p className="text-chalk-600 text-[10px] uppercase font-mono">Expected Goals</p>
                          <p className="text-white font-bold">
                            {prediction.prediction.expectedGoals.home} vs {prediction.prediction.expectedGoals.away}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Shield size={16} className="text-chalk-600"/>
                        <div>
                          <p className="text-chalk-600 text-[10px] uppercase font-mono">Clean Sheet Pro</p>
                          <p className="text-white font-bold">{Math.max(prediction.prediction?.homeWin || 0, prediction.prediction?.awayWin || 0)}%</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 opacity-40">
                  <HelpCircle size={40} className="mx-auto mb-3 text-chalk-600"/>
                  <p className="text-white text-sm">Prediction data unavailable for this match.</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-white/[0.06] bg-white/[0.02] flex justify-center">
              <p className="text-chalk-700 text-[10px] uppercase tracking-widest font-mono">
                Analyzing momentum · H2H · Team News · xG Engine v2.4
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
