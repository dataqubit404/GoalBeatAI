// GoalBeat AI — Home Page (Storytelling Scroll)
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Zap, BarChart3, Trophy, Users, GitCompare, Shield } from "lucide-react";
import { useReveal } from "../../hooks";
import { LEAGUES } from "../../lib/constants";

/**
 * ── HERO CONFIGURATION ───────────────────────────────────────
 * 
 * To add your own images:
 * 1. Place your image files in the /frontend/public/ folder.
 * 2. Update the paths below (e.g., STADIUM: "/my-background.jpg")
 * ─────────────────────────────────────────────────────────────
 */
const HERO_CONFIG = {
  // Local path (user can drop files here)
  LOCAL_BG: "/images/hero/background.jpg",
  // High-quality fallback if local file is missing
  FALLBACK_BG: "https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&q=80&w=2000",
};

// ── Text Reveal component ────────────────────────────────────
function RevealText({ children, delay = 0, className = "" }) {
  const { ref, visible } = useReveal(0.2);
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={visible ? { y: 0, opacity: 1 } : {}}
        transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}

// ── Section with scroll reveal ───────────────────────────────
function RevealSection({ children, delay = 0, className = "" }) {
  const { ref, visible } = useReveal(0.15);
  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "visible" : ""} reveal-delay-${Math.ceil(delay * 10)} ${className}`}
    >
      {children}
    </div>
  );
}

// ── Feature Card ─────────────────────────────────────────────
function FeatureCard({ icon: Icon, title, description, delay }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className="glass-hover p-6 group"
    >
      <div className="w-10 h-10 rounded-xl bg-grass-500/10 flex items-center justify-center mb-4 group-hover:bg-grass-500/20 transition-colors">
        <Icon size={18} className="text-grass-400" />
      </div>
      <h3 className="font-semibold text-white mb-2">{title}</h3>
      <p className="text-chalk-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
}

// ── Featured League Pills ─────────────────────────────────────
function LeaguePill({ league, index }) {
  const { ref, visible } = useReveal(0.1);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={visible ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.4, delay: index * 0.06 }}
    >
      <Link
        to={`/league/${league.id}`}
        className="flex items-center gap-2.5 glass-hover px-4 py-2.5 group"
      >
        <img
          src={league.logo}
          alt={league.name}
          className="w-6 h-6 object-contain shrink-0"
          onError={(e) => { e.target.style.display = 'none'; }}
        />
        <div className="min-w-0">
          <p className="text-white text-sm font-medium truncate group-hover:text-grass-400 transition-colors">
            {league.name}
          </p>
          <p className="text-chalk-600 text-xs">{league.country}</p>
        </div>
        <ArrowRight size={14} className="ml-auto text-chalk-600 group-hover:text-grass-400 transition-colors shrink-0" />
      </Link>
    </motion.div>
  );
}

// ── Stat Counter ─────────────────────────────────────────────
function StatCounter({ value, label }) {
  return (
    <div className="text-center group">
      <p className="text-3d text-5xl text-gradient-green mb-1 group-hover:scale-110 transition-transform duration-300">{value}</p>
      <p className="text-chalk-400 text-xs font-mono uppercase tracking-widest">{label}</p>
    </div>
  );
}

// ── Pitch Lines Background ────────────────────────────────────
function HeroBackground({ src, fallbackSrc }) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError && fallbackSrc) {
      setImgSrc(fallbackSrc);
      setHasError(true);
    }
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <img 
        src={imgSrc} 
        onError={handleError}
        alt="Hero background" 
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      />
      {/* Only darken the very bottom so text above is readable */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,5,5,0.1) 0%, rgba(5,5,5,0.15) 50%, rgba(5,5,5,0.75) 100%)', zIndex: 1 }} />
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const featuredLeagues = LEAGUES.filter((l) =>
    [2, 39, 140, 78, 135, 61, 1, 3].includes(l.id)
  );

  const features = [
    { icon: Zap, title: "Live Scores", description: "Real-time match updates with goals, cards, and substitution timelines as they happen." },
    { icon: BarChart3, title: "AI Predictions", description: "Match outcome predictions using xG, last 5 form, H2H data and home advantage algorithms." },
    { icon: Trophy, title: "All Major Leagues", description: "World Cup, UCL, Top 10 domestic leagues, domestic cups and continental tournaments." },
    { icon: GitCompare, title: "League Comparison", description: "Compare 3 competitions side-by-side — standings, top scorers and analytics in one view." },
    { icon: Users, title: "Squad Builder", description: "Build tactical lineups with drag-and-drop, choose formations and simulate winning chances." },
    { icon: Shield, title: "Club Intelligence", description: "Deep club profiles: history, legends, squad stats, home/away splits and momentum graphs." },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ── */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center overflow-hidden">
        <HeroBackground src={HERO_CONFIG.LOCAL_BG} fallbackSrc={HERO_CONFIG.FALLBACK_BG} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-7xl mx-auto px-4 pt-16 pb-24"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <span className="badge-green">
              <span className="live-dot" /> Live Data Active
            </span>
          </motion.div>

          <div className="max-w-4xl">
            <div className="overflow-hidden mb-2">
              <motion.p
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-matchday text-[12vw] md:text-[5rem] lg:text-[6rem] leading-[0.85] mb-2 opacity-40"
                style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)', color: 'transparent' }}
              >
                MATCHDAY
              </motion.p>
            </div>
            <div className="overflow-hidden mb-8">
              <motion.h1
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="text-matchday text-[12vw] md:text-[7rem] lg:text-[10rem] text-white leading-[0.85] tracking-tighter"
              >
                GOALBEAT <span className="text-grass-400">AI</span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-chalk-400 text-lg md:text-xl max-w-xl leading-relaxed mb-10"
            >
              Real-time standings, AI-powered match predictions, live scores, and deep analytics
              for every major league and tournament on the planet.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="flex flex-wrap gap-3"
            >
              <Link to="/leagues" className="btn-primary">
                Explore Leagues <ArrowRight size={16} />
              </Link>
              <Link to="/dashboard" className="btn-ghost">
                My Dashboard
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-chalk-600 text-xs font-mono">SCROLL</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-px h-8 bg-gradient-to-b from-chalk-600 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── STATS STRIP ── */}
      <section className="border-y border-white/[0.05] py-10 pitch-lines">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: "25+", label: "Leagues Tracked" },
              { value: "100%", label: "Free API Tier" },
              { value: "60s", label: "Data Refresh Rate" },
              { value: "xG", label: "AI Prediction Engine" },
            ].map((s, i) => (
              <RevealSection key={i} delay={i * 0.1}>
                <StatCounter {...s} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY SECTION 1: What is GoalBeat ── */}
      <section className="py-24 relative overflow-hidden">
        <HeroBackground src="/images/story/story1.jpg" fallbackSrc="https://images.unsplash.com/photo-1627913388613-2db5c9a75107?auto=format&fit=crop&q=80&w=2000" />
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <RevealText delay={0}>
              <p className="section-eyebrow mb-4">The Platform</p>
            </RevealText>
            <RevealText delay={0.1}>
              <h2 className="text-matchday text-6xl md:text-9xl text-white leading-[0.9] mb-8">
                EVERY GOAL<br />EVERY STAT<br />
                <span className="text-chalk-400">FLAT DATA</span>
              </h2>
            </RevealText>
            <RevealSection delay={0.2}>
              <p className="text-chalk-400 leading-relaxed mb-8">
                GoalBeat AI aggregates real-time data from the world's biggest football competitions.
                From the Premier League to Serie A, from the World Cup to domestic cups —
                every match, every table, every goal. Powered by data. Built for fans.
              </p>
              <Link to="/leagues" className="btn-primary inline-flex">
                Browse All Leagues <ArrowRight size={16} />
              </Link>
            </RevealSection>
          </div>

          {/* League preview grid */}
          <div className="grid grid-cols-2 gap-2">
            {featuredLeagues.map((league, i) => (
              <LeaguePill key={league.id} league={league} index={i} />
            ))}
          </div>
        </div>
      </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-24 bg-pitch-900/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <RevealText>
              <p className="section-eyebrow mb-3">Features</p>
            </RevealText>
            <RevealText delay={0.1}>
              <h2 className="text-matchday text-6xl md:text-9xl text-white leading-[0.9]">PRECISION<br />FOOTBALL</h2>
            </RevealText>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <FeatureCard key={i} {...f} delay={i * 0.08} />
            ))}
          </div>
        </div>
      </section>

      {/* ── STORY SECTION 2: Predictions ── */}
      <section className="py-24 relative overflow-hidden">
        <HeroBackground src="/images/story/story2.jpg" fallbackSrc="https://images.unsplash.com/photo-1599313000914-161476d0dd25?auto=format&fit=crop&q=80&w=2000" />
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Visual: prediction preview */}
          <RevealSection>
            <div className="glass p-6 space-y-4">
              <div className="flex items-center justify-between mb-6">
                <span className="section-eyebrow">Match Prediction</span>
                <span className="badge-green">AI Powered</span>
              </div>

              {/* Teams */}
              <div className="flex items-center gap-4">
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-2 border border-white/10 group-hover:border-grass-500/30 transition-colors">
                    <img src="https://media.api-sports.io/football/teams/50.png" alt="Man City" className="w-8 h-8 object-contain" />
                  </div>
                  <p className="text-white font-medium text-sm">Manchester City</p>
                </div>
                <div className="text-chalk-600 font-mono text-sm">vs</div>
                <div className="flex-1 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto mb-2 border border-white/10 group-hover:border-blue-500/30 transition-colors">
                    <img src="https://media.api-sports.io/football/teams/42.png" alt="Arsenal" className="w-8 h-8 object-contain" />
                  </div>
                  <p className="text-white font-medium text-sm">Arsenal</p>
                </div>
              </div>

              {/* Win bars */}
              {[
                { label: "Man City Win", pct: 52, color: "bg-grass-500" },
                { label: "Draw", pct: 24, color: "bg-amber-400" },
                { label: "Arsenal Win", pct: 24, color: "bg-blue-500" },
              ].map((b) => (
                <div key={b.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-chalk-400 text-xs">{b.label}</span>
                    <span className="font-mono text-xs text-white">{b.pct}%</span>
                  </div>
                  <div className="h-1.5 bg-white/[0.05] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${b.pct}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={`h-full ${b.color} rounded-full`}
                    />
                  </div>
                </div>
              ))}

              <div className="border-t border-white/[0.06] pt-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-chalk-600 text-xs mb-1">Expected Goals (Home)</p>
                  <p className="font-mono text-white text-lg">1.84</p>
                </div>
                <div>
                  <p className="text-chalk-600 text-xs mb-1">Expected Goals (Away)</p>
                  <p className="font-mono text-white text-lg">1.21</p>
                </div>
              </div>
            </div>
          </RevealSection>

          <div>
            <RevealText>
              <p className="section-eyebrow mb-4">AI Predictions</p>
            </RevealText>
            <RevealText delay={0.1}>
              <h2 className="text-matchday text-6xl md:text-9xl text-white leading-[0.9] mb-8">
                PREDICT WITH<br />
                <span className="text-outline border-white/20">CONFIDENCE</span>
              </h2>
            </RevealText>
            <RevealSection delay={0.2}>
              <p className="text-chalk-400 leading-relaxed mb-4">
                Our prediction engine analyzes Mbappe's sprint speeds, Ronaldo's leap heights, and thousands of data points
                to give you the edge. No bulky gradients, just pure intelligence.
              </p>
              <p className="text-chalk-400 leading-relaxed mb-8">
                Click any upcoming fixture to see win probabilities, predicted score, and confidence levels.
              </p>
              <Link to="/leagues" className="btn-ghost inline-flex">
                View Upcoming Matches <ArrowRight size={16} />
              </Link>
            </RevealSection>
          </div>
        </div>
      </div>
      </section>

      {/* ── SQUAD BUILDER TEASER ── */}
      <section className="py-24 bg-pitch-900/30">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <RevealText>
            <p className="section-eyebrow mb-4">Squad Builder</p>
          </RevealText>
          <RevealText delay={0.1}>
            <h2 className="text-matchday text-6xl md:text-9xl text-white mb-6">
              BUILD YOUR<br />
              <span className="text-outline">ELITE XI</span>
            </h2>
          </RevealText>
          <RevealSection delay={0.2}>
            <p className="text-chalk-400 text-lg max-w-xl mx-auto mb-10">
              Drag-and-drop squad builder with real player data. Pick formations, substitute players,
              and simulate match winning chances before kickoff.
            </p>
            <Link to="/squad-builder" className="btn-primary inline-flex">
              Open Squad Builder <ArrowRight size={16} />
            </Link>
          </RevealSection>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-glow-green pointer-events-none" />
        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <RevealText delay={0.1}>
            <h2 className="text-matchday text-8xl md:text-[14rem] text-white leading-[0.8] mb-8">
              READY TO<br />
              <span className="text-chalk-600">WIN?</span>
            </h2>
          </RevealText>
          <RevealSection delay={0.2}>
            <p className="text-chalk-400 text-lg mb-10 max-w-md mx-auto">
              Pick a league, track your favourite clubs, and never miss a match again.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link to="/leagues" className="btn-primary">
                Start Exploring <ArrowRight size={16} />
              </Link>
              <Link to="/compare" className="btn-ghost">
                Compare Leagues
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>
    </div>
  );
}
