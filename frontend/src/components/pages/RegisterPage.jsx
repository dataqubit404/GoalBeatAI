// GoalBeat AI — Register Page
// Background: drop an image as /public/images/auth/background.jpg
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Mail, Lock, Loader2, ArrowRight, CheckCircle } from "lucide-react";
import axios from "axios";
import { useStore } from "../../store/useStore";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";
const AUTH_BG = "/images/auth/background.jpg";

const perks = [
  "Track unlimited favourite clubs",
  "AI-powered match predictions",
  "Personalized league alerts",
  "Exclusive tactical insights",
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const setAuth = useStore((s) => s.setAuth);
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData, { timeout: 8000 });
      setAuth(res.data.user, res.data.token);
      navigate("/");
    } catch (err) {
      if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
        setError("Server took too long. Please try again.");
      } else {
        setError(err.response?.data?.error || "Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img src={AUTH_BG} alt="" className="w-full h-full object-cover" onError={e=>e.target.style.display="none"}/>
        <div className="absolute inset-0" style={{
          background: "linear-gradient(135deg, rgba(5,5,5,0.92) 0%, rgba(5,5,5,0.72) 50%, rgba(5,5,5,0.90) 100%)"
        }}/>
      </div>

      {/* Left branding */}
      <div className="hidden lg:flex flex-col justify-between p-12 w-[460px] relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-16">
            <div className="w-8 h-8 bg-grass-500 flex items-center justify-center rounded-lg">
              <span className="text-pitch-950 font-black text-sm">GB</span>
            </div>
            <span className="text-white font-bold tracking-widest text-sm uppercase">GoalBeat AI</span>
          </div>
          <p className="text-matchday text-[4rem] leading-none text-white mb-6">
            JOIN THE<br/><span className="text-grass-400">BEAUTIFUL</span><br/>GAME
          </p>
          <div className="space-y-3 mt-8">
            {perks.map(perk => (
              <div key={perk} className="flex items-center gap-3">
                <CheckCircle size={14} className="text-grass-400 shrink-0"/>
                <span className="text-chalk-400 text-sm">{perk}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-chalk-700 text-[10px] font-mono">FREE · NO CREDIT CARD REQUIRED</p>
      </div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center px-6 py-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div
            className="p-10 border border-white/10 rounded-2xl"
            style={{ backgroundColor: "rgba(10,10,10,0.88)", backdropFilter: "blur(20px)" }}
          >
            <div className="mb-10">
              <p className="text-grass-400 text-[10px] font-mono uppercase tracking-[0.3em] mb-3">
                Get started for free
              </p>
              <h1
                className="text-white leading-none mb-1 font-matchday"
                style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.02em" }}
              >
                CREATE ACCOUNT
              </h1>
              <p className="text-chalk-500 text-sm mt-2">Join thousands of football analysts</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="py-3 px-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium rounded-xl"
                >
                  ⚠ {error}
                </motion.div>
              )}

              {[
                { name: "username", label: "Username", icon: User, type: "text", placeholder: "johndoe" },
                { name: "email",    label: "Email",    icon: Mail, type: "email", placeholder: "john@example.com" },
                { name: "password", label: "Password", icon: Lock, type: "password", placeholder: "Min. 8 characters" },
              ].map(({ name, label, icon: Icon, type, placeholder }) => (
                <div key={name} className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-chalk-500">{label}</label>
                  <div className="relative">
                    <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-chalk-600" size={16}/>
                    <input
                      name={name} type={type} required
                      value={formData[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      className="w-full pl-11 pr-4 py-3.5 bg-white/[0.04] border border-white/10 text-white text-sm placeholder:text-chalk-700 focus:outline-none focus:border-grass-500 transition-colors rounded-xl"
                    />
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-3 py-1">
                <input type="checkbox" id="terms" required className="mt-1 accent-grass-500 shrink-0"/>
                <label htmlFor="terms" className="text-[10px] text-chalk-500 leading-relaxed">
                  I agree to the Terms of Service and Privacy Policy.
                </label>
              </div>

              <button
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 py-4 bg-grass-500 text-pitch-950 font-black text-sm uppercase tracking-widest transition-all hover:bg-grass-400 disabled:opacity-50 mt-2 rounded-xl"
                style={{ letterSpacing: "0.15em" }}
              >
                {loading ? <Loader2 className="animate-spin" size={18}/> : <>CREATE ACCOUNT <ArrowRight size={16}/></>}
              </button>
            </form>

            <p className="text-center text-chalk-600 text-xs mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-grass-400 font-bold hover:text-grass-300 transition-colors uppercase tracking-wider text-[10px]">
                Sign In →
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
