// GoalBeat AI — Sign In Page
// Background: drop an image as /images/auth/background.jpg
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import axios from "axios";
import { useStore } from "../../store/useStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
// ↓ Place your auth background image at: /public/images/auth/background.jpg
const AUTH_BG = "/images/auth/background.jpg";

export default function LoginPage() {
  const navigate = useNavigate();
  const setAuth = useStore((s) => s.setAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/login`, { email, password }, { timeout: 8000 });
      setAuth(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("Server took too long. Try again in a moment.");
      } else {
        setError(err.response?.data?.error || "Login failed. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={AUTH_BG}
          alt=""
          className="w-full h-full object-cover"
          onError={(e) => { e.target.style.display = "none"; }}
        />
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.75) 50%, rgba(5,5,5,0.88) 100%)"
        }}/>
      </div>

      {/* Left branding panel */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[480px] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-grass-500 flex items-center justify-center rounded-sm">
              <span className="text-pitch-950 font-black text-sm">GB</span>
            </div>
            <span className="text-white font-bold tracking-widest text-sm uppercase">GoalBeat AI</span>
          </div>
          <p className="text-matchday text-[4.5rem] leading-none text-white mb-4" style={{WebkitTextStroke:"1px rgba(255,255,255,0.1)"}}>
            MATCH<br/>DAY<br/><span className="text-grass-400">INTEL</span>
          </p>
          <p className="text-chalk-400 text-sm max-w-xs leading-relaxed">
            Real-time standings, AI predictions, and deep analytics for every major league.
          </p>
        </div>
        <div className="flex gap-3">
          {["Premier League","La Liga","Bundesliga"].map(l => (
            <span key={l} className="text-[9px] font-bold uppercase tracking-widest text-chalk-600 border border-white/10 px-2 py-1">{l}</span>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Card */}
          <div
            className="p-10 border border-white/10 rounded-2xl"
            style={{ backgroundColor: "rgba(10,10,10,0.85)", backdropFilter: "blur(20px)" }}
          >
            {/* Title */}
            <div className="mb-10">
              <p className="text-grass-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">
                Welcome back
              </p>
              <h1
                className="text-white leading-none mb-1 font-matchday"
                style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)", letterSpacing: "-0.02em" }}
              >
                SIGN IN
              </h1>
              <p className="text-chalk-500 text-sm mt-2">Access your Matchday Intelligence</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl"
                >
                  ⚠ {error}
                </motion.div>
              )}

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-chalk-500">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-chalk-600" size={16}/>
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full h-13 pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-chalk-700 focus:outline-none focus:border-grass-500 transition-colors rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-chalk-500">Password</label>
                  <Link to="/forgot-password" className="text-[10px] text-grass-500 hover:text-grass-400 transition-colors font-bold uppercase tracking-wider">Forgot?</Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-chalk-600" size={16}/>
                  <input
                    type="password" required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full h-13 pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-chalk-700 focus:outline-none focus:border-grass-500 transition-colors rounded-xl"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-white text-pitch-950 font-black text-sm uppercase tracking-widest transition-all hover:bg-grass-400 disabled:opacity-50 mt-2 rounded-xl"
                style={{ letterSpacing: "0.15em" }}
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <>SIGN IN <ArrowRight size={16}/></>}
              </button>
            </form>

            <p className="text-center text-chalk-600 text-xs mt-8">
              No account?{" "}
              <Link to="/register" className="text-grass-400 font-bold hover:text-grass-300 transition-colors uppercase tracking-wider text-[10px]">
                Create one →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
