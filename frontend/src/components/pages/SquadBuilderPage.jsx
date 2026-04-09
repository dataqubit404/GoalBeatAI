// GoalBeat AI — Squad Builder (Tactical Sandbox v3)
// - Auto-fills pitch on team selection
// - Players locked to exactly one slot (removed from list when placed)
// - Substitution bench section
// - Players fit perfectly inside circles
import { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DndContext, useDraggable, useDroppable, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { RotateCcw, Zap, Users, Swords, TrendingUp, Search, ChevronDown } from "lucide-react";
import { FORMATIONS } from "../../lib/constants";

// ── Demo Teams ─────────────────────────────────────────────────
const DEMO_TEAMS = [
  {
    id: 40, name: "Liverpool", logo: "https://media.api-sports.io/football/teams/40.png",
    players: [
      { id: 1001, name: "Alisson",         position: "Goalkeeper", number: 1  },
      { id: 1002, name: "Alexander-Arnold",position: "Defender",   number: 66 },
      { id: 1003, name: "Van Dijk",         position: "Defender",   number: 4  },
      { id: 1004, name: "Konaté",           position: "Defender",   number: 5  },
      { id: 1005, name: "Robertson",        position: "Defender",   number: 26 },
      { id: 1006, name: "Szoboszlai",       position: "Midfielder", number: 8  },
      { id: 1007, name: "Mac Allister",     position: "Midfielder", number: 10 },
      { id: 1008, name: "Endo",             position: "Midfielder", number: 3  },
      { id: 1009, name: "Salah",            position: "Attacker",   number: 11 },
      { id: 1010, name: "Nunez",            position: "Attacker",   number: 9  },
      { id: 1011, name: "Gakpo",            position: "Attacker",   number: 18 },
      // Subs
      { id: 1012, name: "Kelleher",         position: "Goalkeeper", number: 62, isSub: true },
      { id: 1013, name: "Tsimikas",         position: "Defender",   number: 21, isSub: true },
      { id: 1014, name: "Gravenberch",      position: "Midfielder", number: 38, isSub: true },
      { id: 1015, name: "Jones",            position: "Midfielder", number: 17, isSub: true },
      { id: 1016, name: "Díaz",             position: "Attacker",   number: 7,  isSub: true },
    ],
  },
  {
    id: 541, name: "Real Madrid", logo: "https://media.api-sports.io/football/teams/541.png",
    players: [
      { id: 2001, name: "Courtois",         position: "Goalkeeper", number: 1  },
      { id: 2002, name: "Carvajal",         position: "Defender",   number: 2  },
      { id: 2003, name: "Militão",          position: "Defender",   number: 3  },
      { id: 2004, name: "Rüdiger",          position: "Defender",   number: 22 },
      { id: 2005, name: "Mendy",            position: "Defender",   number: 23 },
      { id: 2006, name: "Valverde",         position: "Midfielder", number: 15 },
      { id: 2007, name: "Tchouaméni",       position: "Midfielder", number: 8  },
      { id: 2008, name: "Bellingham",       position: "Midfielder", number: 5  },
      { id: 2009, name: "Rodrygo",          position: "Attacker",   number: 11 },
      { id: 2010, name: "Mbappé",           position: "Attacker",   number: 9  },
      { id: 2011, name: "Vinícius Jr",      position: "Attacker",   number: 7  },
      { id: 2012, name: "Lunin",            position: "Goalkeeper", number: 13, isSub: true },
      { id: 2013, name: "Lucas Vázquez",    position: "Defender",   number: 17, isSub: true },
      { id: 2014, name: "Camavinga",        position: "Midfielder", number: 12, isSub: true },
      { id: 2015, name: "Modric",           position: "Midfielder", number: 10, isSub: true },
      { id: 2016, name: "Joselu",           position: "Attacker",   number: 14, isSub: true },
    ],
  },
  {
    id: 50, name: "Man City", logo: "https://media.api-sports.io/football/teams/50.png",
    players: [
      { id: 3001, name: "Ederson",          position: "Goalkeeper", number: 31 },
      { id: 3002, name: "Walker",           position: "Defender",   number: 2  },
      { id: 3003, name: "Dias",             position: "Defender",   number: 3  },
      { id: 3004, name: "Akanji",           position: "Defender",   number: 25 },
      { id: 3005, name: "Gvardiol",         position: "Defender",   number: 24 },
      { id: 3006, name: "Rodri",            position: "Midfielder", number: 16 },
      { id: 3007, name: "De Bruyne",        position: "Midfielder", number: 17 },
      { id: 3008, name: "Bernardo Silva",   position: "Midfielder", number: 20 },
      { id: 3009, name: "Doku",             position: "Attacker",   number: 11 },
      { id: 3010, name: "Haaland",          position: "Attacker",   number: 9  },
      { id: 3011, name: "Foden",            position: "Attacker",   number: 47 },
      { id: 3012, name: "Ortega",           position: "Goalkeeper", number: 18, isSub: true },
      { id: 3013, name: "Stones",           position: "Defender",   number: 5,  isSub: true },
      { id: 3014, name: "Kovacic",          position: "Midfielder", number: 8,  isSub: true },
      { id: 3015, name: "Gündogan",         position: "Midfielder", number: 19, isSub: true },
      { id: 3016, name: "Silva",            position: "Attacker",   number: 21, isSub: true },
    ],
  },
  {
    id: 529, name: "Barcelona", logo: "https://media.api-sports.io/football/teams/529.png",
    players: [
      { id: 4001, name: "Ter Stegen",       position: "Goalkeeper", number: 1  },
      { id: 4002, name: "João Cancelo",     position: "Defender",   number: 2  },
      { id: 4003, name: "Araújo",           position: "Defender",   number: 4  },
      { id: 4004, name: "Christensen",      position: "Defender",   number: 15 },
      { id: 4005, name: "Balde",            position: "Defender",   number: 3  },
      { id: 4006, name: "Pedri",            position: "Midfielder", number: 8  },
      { id: 4007, name: "Gavi",             position: "Midfielder", number: 6  },
      { id: 4008, name: "De Jong",          position: "Midfielder", number: 21 },
      { id: 4009, name: "Yamal",            position: "Attacker",   number: 27 },
      { id: 4010, name: "Lewandowski",      position: "Attacker",   number: 9  },
      { id: 4011, name: "Raphinha",         position: "Attacker",   number: 11 },
      { id: 4012, name: "Iñaki Peña",       position: "Goalkeeper", number: 13, isSub: true },
      { id: 4013, name: "Koundé",           position: "Defender",   number: 23, isSub: true },
      { id: 4014, name: "Fermín",           position: "Midfielder", number: 16, isSub: true },
      { id: 4015, name: "Olmo",             position: "Midfielder", number: 20, isSub: true },
      { id: 4016, name: "Torres",           position: "Attacker",   number: 7,  isSub: true },
    ],
  },
];

// ── Formation coordinate system ─────────────────────────────────
const POSITION_COORDS = {
  GK:  { x: 50, y: 90 },
  RB:  { x: 82, y: 74 }, LB: { x: 18, y: 74 },
  RWB: { x: 88, y: 62 }, LWB:{ x: 12, y: 62 },
  RM:  { x: 85, y: 50 }, LM: { x: 15, y: 50 },
  CAM: { x: 50, y: 38 }, RAM:{ x: 70, y: 38 }, LAM:{ x: 30, y: 38 },
  CDM: { x: 50, y: 62 },
  RW:  { x: 82, y: 22 }, LW: { x: 18, y: 22 },
  RF:  { x: 68, y: 22 }, LF: { x: 32, y: 22 },
};

function buildSlots(formation, prefix = "") {
  const counts = {}, totals = {};
  formation.positions.forEach(p => { totals[p] = (totals[p] || 0) + 1; });
  return formation.positions.map(pos => {
    counts[pos] = (counts[pos] || 0) + 1;
    const idx = counts[pos] - 1;
    const base = POSITION_COORDS[pos];
    let coords;
    if (base) {
      coords = { ...base };
    } else if (pos === "CB") {
      const t = totals.CB;
      const xs = t === 1 ? [50] : t === 2 ? [36, 64] : t === 3 ? [25, 50, 75] : [20, 40, 60, 80];
      coords = { x: xs[idx] ?? 50, y: 74 };
    } else if (pos === "CM") {
      const t = totals.CM;
      const xs = t === 1 ? [50] : t === 2 ? [35, 65] : t === 3 ? [25, 50, 75] : [20, 40, 60, 80];
      coords = { x: xs[idx] ?? 50, y: 50 };
    } else if (pos === "ST") {
      const t = totals.ST;
      const xs = t === 1 ? [50] : [36, 64];
      coords = { x: xs[idx] ?? 50, y: 16 };
    } else if (pos === "WB") {
      coords = { x: idx === 0 ? 88 : 12, y: 62 };
    } else {
      coords = { x: 50, y: 50 };
    }
    const key = `${prefix}-${pos}-${idx}`;
    return { key, pos, coords };
  });
}

// ── Auto-fill: map formation positions → players by order ─────
function autoFillSlots(slots, players) {
  const starters = players.filter(p => !p.isSub);
  const posOrder = ["Goalkeeper", "Defender", "Midfielder", "Attacker"];
  const sorted = [...starters].sort((a, b) =>
    posOrder.indexOf(a.position) - posOrder.indexOf(b.position)
  );
  const result = {};
  slots.forEach((slot, i) => {
    if (sorted[i]) result[slot.key] = sorted[i];
  });
  return result;
}

// ── Draggable Token (pitch) ──────────────────────────────────
function PitchToken({ id, player, color }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id });
  const short = player.name.split(" ").pop();
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined,
        zIndex: isDragging ? 999 : 10,
        opacity: isDragging ? 0.3 : 1,
        cursor: isDragging ? "grabbing" : "grab",
        position: "absolute",
        left: 0, top: 0,
      }}
      {...listeners}
      {...attributes}
    >
      <div className="flex flex-col items-center gap-0.5" style={{ width: 48, transform: "translate(-50%,-50%)" }}>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold border-2 overflow-hidden"
          style={{ borderColor: color, backgroundColor: "#0a1a0a", flexShrink: 0 }}
        >
          <span style={{ fontSize: 11, fontWeight: 700 }}>{player.number}</span>
        </div>
        <div
          className="text-center text-white font-semibold truncate w-full"
          style={{
            fontSize: 8,
            background: "rgba(0,0,0,0.75)",
            padding: "1px 3px",
            borderRadius: 3,
            lineHeight: "1.3",
          }}
        >
          {short}
        </div>
      </div>
    </div>
  );
}

// ── Droppable slot ──────────────────────────────────────────
function PitchSlot({ slotKey, pos, coords, player, color, mode }) {
  const { isOver, setNodeRef } = useDroppable({ id: slotKey });
  const adjustedCoords = mode === "h2h"
    ? (slotKey.startsWith("H-")
        ? { x: coords.x, y: 50 + coords.y * 0.47 }
        : { x: 100 - coords.x, y: (100 - coords.y) * 0.47 })
    : coords;

  return (
    <div
      ref={setNodeRef}
      style={{
        position: "absolute",
        left: `${adjustedCoords.x}%`,
        top: `${adjustedCoords.y}%`,
        zIndex: player ? 10 : 5,
      }}
    >
      {player ? (
        <PitchToken id={`pit-${slotKey}`} player={player} color={color} />
      ) : (
        <div
          style={{
            width: 38, height: 38,
            borderRadius: "50%",
            border: `2px dashed ${isOver ? "#fbbf24" : "rgba(255,255,255,0.22)"}`,
            background: isOver ? "rgba(251,191,36,0.1)" : "rgba(255,255,255,0.04)",
            transform: `translate(-50%,-50%) scale(${isOver ? 1.18 : 1})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
            cursor: "copy",
          }}
        >
          <span style={{ fontSize: 7, color: isOver ? "#fbbf24" : "rgba(255,255,255,0.25)", fontWeight: 700 }}>{pos}</span>
        </div>
      )}
    </div>
  );
}

// ── Sidebar player row ────────────────────────────────────────
function SidebarPlayer({ player }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `bench-${player.id}`,
  });
  return (
    <div
      ref={setNodeRef}
      style={{ transform: transform ? `translate3d(${transform.x}px,${transform.y}px,0)` : undefined, zIndex: isDragging ? 999 : 1, opacity: isDragging ? 0.4 : 1 }}
      {...listeners}
      {...attributes}
      className="flex items-center gap-2 px-3 py-2 hover:bg-white/5 rounded-lg cursor-grab transition-colors active:cursor-grabbing"
    >
      <div className="w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
        <span className="text-white text-[10px] font-bold">{player.number}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-xs font-semibold truncate">{player.name}</p>
        <p className="text-chalk-600 text-[9px]">{player.position}</p>
      </div>
    </div>
  );
}
function SidebarDroppable({ children }) {
  const { isOver, setNodeRef } = useDroppable({ id: "sidebar-bench" });
  return (
    <div ref={setNodeRef} className={`transition-colors duration-200 h-full flex flex-col ${isOver ? "bg-grass-500/10" : ""}`}>
      {children}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function SquadBuilderPage() {
  const [mode, setMode] = useState("h2h");
  const [homeFormIdx, setHomeFormIdx] = useState(0);
  const [awayFormIdx, setAwayFormIdx] = useState(0);
  const [homeSlots, setHomeSlots] = useState({});
  const [awaySlots, setAwaySlots] = useState({});
  const [activePanel, setActivePanel] = useState("home");
  const [homeTeam, setHomeTeam] = useState(DEMO_TEAMS[0]);
  const [awayTeam, setAwayTeam] = useState(DEMO_TEAMS[1]);
  const [prediction, setPrediction] = useState(null);
  const [search, setSearch] = useState("");

  const homeFm = FORMATIONS[homeFormIdx];
  const awayFm = FORMATIONS[awayFormIdx];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const homeSlotList = useMemo(() => buildSlots(homeFm, "H"), [homeFm]);
  const awaySlotList = useMemo(() => buildSlots(awayFm, "A"), [awayFm]);

  // Which player IDs are already on the pitch
  const homePitchIds = useMemo(() => new Set(Object.values(homeSlots).map(p => p.id)), [homeSlots]);
  const awayPitchIds = useMemo(() => new Set(Object.values(awaySlots).map(p => p.id)), [awaySlots]);

  const selectTeam = (team, side) => {
    const slots = buildSlots(side === "home" ? homeFm : awayFm, side === "home" ? "H" : "A");
    const filled = autoFillSlots(slots, team.players);
    if (side === "home") { setHomeTeam(team); setHomeSlots(filled); }
    else              { setAwayTeam(team); setAwaySlots(filled); }
  };

  // Auto-fill when formation changes
  useEffect(() => {
    const slots = buildSlots(homeFm, "H");
    setHomeSlots(autoFillSlots(slots, homeTeam.players));
  }, [homeFormIdx]);

  useEffect(() => {
    const slots = buildSlots(awayFm, "A");
    setAwaySlots(autoFillSlots(slots, awayTeam.players));
  }, [awayFormIdx]);

  // Initial fill on mount
  useEffect(() => {
    const hSlots = buildSlots(homeFm, "H");
    const aSlots = buildSlots(awayFm, "A");
    setHomeSlots(autoFillSlots(hSlots, homeTeam.players));
    setAwaySlots(autoFillSlots(aSlots, awayTeam.players));
  }, []);

  const handleDragEnd = useCallback(({ active, over }) => {
    if (!over) return;
    const activeId = String(active.id);
    const overId = String(over.id);

    let activePlayer = null;
    let srcSlotKey = null;
    let srcIsHome = true;

    // Identify source
    if (activeId.startsWith("pit-H-")) {
      srcSlotKey = activeId.replace("pit-", "");
      activePlayer = homeSlots[srcSlotKey];
      srcIsHome = true;
    } else if (activeId.startsWith("pit-A-")) {
      srcSlotKey = activeId.replace("pit-", "");
      activePlayer = awaySlots[srcSlotKey];
      srcIsHome = false;
    } else if (activeId.startsWith("bench-")) {
      const pid = parseInt(activeId.replace("bench-", ""));
      srcIsHome = activePanel === "home";
      activePlayer = (srcIsHome ? homeTeam : awayTeam).players.find(p => p.id === pid);
    }

    if (!activePlayer) return;

    // CASE 1: Dropped on a pitch slot
    if (overId.startsWith("H-") || overId.startsWith("A-")) {
      const targetIsHome = overId.startsWith("H-");
      if (targetIsHome !== srcIsHome) return; // Prevent cross-team dragging

      const targetSlots = targetIsHome ? homeSlots : awaySlots;
      const setTargetSlots = targetIsHome ? setHomeSlots : setAwaySlots;
      const existingPlayerAtTarget = targetSlots[overId];

      setTargetSlots(prev => {
        const next = { ...prev };
        if (srcSlotKey) {
          // It was a pitch-to-pitch move/swap
          if (existingPlayerAtTarget) {
            next[srcSlotKey] = existingPlayerAtTarget;
          } else {
            delete next[srcSlotKey];
          }
        }
        next[overId] = activePlayer;
        return next;
      });
    }
    // CASE 2: Dropped on the bench/sidebar (remove from pitch)
    else if (overId === "sidebar-bench") {
      if (srcSlotKey) {
        if (srcIsHome) setHomeSlots(v => { const n = { ...v }; delete n[srcSlotKey]; return n; });
        else setAwaySlots(v => { const n = { ...v }; delete n[srcSlotKey]; return n; });
      }
    }
  }, [homeSlots, awaySlots, activePanel, homeTeam, awayTeam]);

  const currentTeam = activePanel === "home" ? homeTeam : awayTeam;
  const pitchIds = activePanel === "home" ? homePitchIds : awayPitchIds;
  const filtered = currentTeam.players.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.position.toLowerCase().includes(search.toLowerCase())
  );

  const starters = filtered.filter(p => !p.isSub);
  const subs = filtered.filter(p => p.isSub);
  const benchAvailable = starters.filter(p => !pitchIds.has(p.id));

  const runPrediction = () => {
    if (Object.keys(homeSlots).length < 5) { alert("Place at least 5 home players first!"); return; }
    const h = 35 + Math.floor(Math.random() * 30);
    const d = 10 + Math.floor(Math.random() * 15);
    const a = Math.max(5, 100 - h - d);
    setPrediction({ home: h, draw: d, away: a, homeName: homeTeam.name, awayName: awayTeam.name });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6">
          <div>
            <p className="section-eyebrow mb-1">Tactical</p>
            <h1 className="section-title">SQUAD BUILDER</h1>
          </div>
          <div className="flex items-center gap-3 md:ml-auto flex-wrap">
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-1">
              {["single","h2h"].map(m => (
                <button key={m} onClick={() => setMode(m)}
                  className={`px-3 py-1.5 rounded text-xs font-bold uppercase transition-all ${mode===m?"bg-grass-500 text-pitch-950":"text-chalk-400"}`}>
                  {m === "h2h" ? "H2H" : "Single"}
                </button>
              ))}
            </div>
            <button onClick={() => {
              const hSlots = buildSlots(homeFm,"H"); const aSlots = buildSlots(awayFm,"A");
              setHomeSlots(autoFillSlots(hSlots,homeTeam.players));
              setAwaySlots(autoFillSlots(aSlots,awayTeam.players));
              setPrediction(null);
            }} className="btn-ghost gap-1.5 text-xs py-2 px-3">
              <RotateCcw size={12}/> Reset
            </button>
            <button onClick={runPrediction} className="btn-primary gap-2 py-2 px-4 text-sm">
              <Zap size={13}/> ANALYZE
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-[1fr,290px] gap-5">
          {/* ── PITCH ── */}
          <div className="space-y-3">
            {/* Formation selectors */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] text-grass-400 font-bold uppercase">Home:</span>
                {FORMATIONS.slice(0,5).map((f,i) => (
                  <button key={f.name} onClick={() => setHomeFormIdx(i)}
                    className={`px-2 py-1 rounded border text-[10px] font-mono transition-all ${homeFormIdx===i?"border-grass-500 text-grass-400 bg-grass-500/10":"border-white/10 text-chalk-500 hover:border-white/30"}`}>
                    {f.name}
                  </button>
                ))}
              </div>
              {mode==="h2h" && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-amber-400 font-bold uppercase">Away:</span>
                  {FORMATIONS.slice(0,5).map((f,i) => (
                    <button key={f.name} onClick={() => setAwayFormIdx(i)}
                      className={`px-2 py-1 rounded border text-[10px] font-mono transition-all ${awayFormIdx===i?"border-amber-500 text-amber-400 bg-amber-500/10":"border-white/10 text-chalk-500 hover:border-white/30"}`}>
                      {f.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Pitch */}
            <div className="relative w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
              style={{ paddingBottom: mode === "h2h" ? "145%" : "145%" }}>
              <div className="absolute inset-0" style={{
                background: "linear-gradient(180deg,#1a5c28 0%,#165020 40%,#1d6030 60%,#165020 100%)",
              }}>
                {/* Pitch SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 145"
                  preserveAspectRatio="none" style={{ opacity: 0.55 }}>
                  {[0,1,2,3,4,5,6,7].map(i=>(<rect key={i} x="0" y={i*18} width="100" height="9" fill="rgba(255,255,255,0.03)"/>))}
                  <rect x="4" y="3" width="92" height="139" fill="none" stroke="white" strokeWidth="0.35"/>
                  <line x1="4" y1="72.5" x2="96" y2="72.5" stroke="white" strokeWidth="0.35"/>
                  <circle cx="50" cy="72.5" r="11" fill="none" stroke="white" strokeWidth="0.35"/>
                  <circle cx="50" cy="72.5" r="0.9" fill="rgba(255,255,255,0.6)"/>
                  <rect x="20" y="3" width="60" height="19" fill="none" stroke="white" strokeWidth="0.35"/>
                  <rect x="33" y="3" width="34" height="10" fill="none" stroke="white" strokeWidth="0.35"/>
                  <circle cx="50" cy="14" r="0.9" fill="rgba(255,255,255,0.6)"/>
                  <rect x="20" y="123" width="60" height="19" fill="none" stroke="white" strokeWidth="0.35"/>
                  <rect x="33" y="132" width="34" height="10" fill="none" stroke="white" strokeWidth="0.35"/>
                  <circle cx="50" cy="131" r="0.9" fill="rgba(255,255,255,0.6)"/>
                  <rect x="38" y="0" width="24" height="3.5" fill="none" stroke="white" strokeWidth="0.35"/>
                  <rect x="38" y="141.5" width="24" height="3.5" fill="none" stroke="white" strokeWidth="0.35"/>
                </svg>

                {/* H2H labels */}
                {mode==="h2h" && (<>
                  <div style={{position:"absolute",left:6,top:"25%",zIndex:3}}>
                    <span style={{writingMode:"vertical-rl",fontSize:8,color:"rgba(251,191,36,0.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>AWAY</span>
                  </div>
                  <div style={{position:"absolute",right:6,bottom:"25%",zIndex:3}}>
                    <span style={{writingMode:"vertical-rl",fontSize:8,color:"rgba(34,197,94,0.5)",fontWeight:700,textTransform:"uppercase",letterSpacing:2}}>HOME</span>
                  </div>
                </>)}

                {/* Home slots */}
                {homeSlotList.map(({ key, pos, coords }) => (
                  <PitchSlot key={key} slotKey={key} pos={pos} coords={coords} player={homeSlots[key]} color="#22c55e" mode={mode}/>
                ))}

                {/* Away slots (H2H) */}
                {mode==="h2h" && awaySlotList.map(({ key, pos, coords }) => (
                  <PitchSlot key={key} slotKey={key} pos={pos} coords={coords} player={awaySlots[key]} color="#f59e0b" mode={mode}/>
                ))}
              </div>
            </div>

            {/* Prediction panel */}
            <AnimatePresence>
              {prediction && (
                <motion.div initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}
                  className="glass p-5 border-t-2 border-grass-500 relative">
                  <button onClick={()=>setPrediction(null)} className="absolute top-3 right-3 text-chalk-600 hover:text-white text-lg">×</button>
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp size={14} className="text-grass-400"/>
                    <span className="text-white font-bold text-xs uppercase tracking-widest">AI Match Prediction</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div><p className="text-3xl font-bold text-grass-400">{prediction.home}%</p><p className="text-chalk-600 text-[10px] uppercase mt-1">{prediction.homeName} Win</p></div>
                    <div><p className="text-3xl font-bold text-chalk-400">{prediction.draw}%</p><p className="text-chalk-600 text-[10px] uppercase mt-1">Draw</p></div>
                    <div><p className="text-3xl font-bold text-amber-400">{prediction.away}%</p><p className="text-chalk-600 text-[10px] uppercase mt-1">{prediction.awayName} Win</p></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="space-y-3">
            {/* Home/Away toggle */}
            {mode==="h2h" && (
              <div className="glass p-1 flex gap-1">
                {["home","away"].map(side => (
                  <button key={side} onClick={() => setActivePanel(side)}
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded text-xs font-bold transition-all uppercase ${
                      activePanel===side
                        ? (side==="home" ? "bg-grass-500 text-pitch-950" : "bg-amber-500 text-pitch-950")
                        : "text-chalk-400 hover:text-white"
                    }`}>
                    <img src={(side==="home"?homeTeam:awayTeam).logo} className="w-4 h-4 object-contain" alt="" onError={e=>e.target.style.display="none"}/>
                    {side==="home" ? homeTeam.name : awayTeam.name}
                  </button>
                ))}
              </div>
            )}

            {/* Team selector */}
            <div className="glass p-3">
              <p className="text-chalk-600 text-[9px] font-mono uppercase tracking-widest mb-2">
                {activePanel==="home"?"Select Home":"Select Away"} Team
              </p>
              <div className="grid grid-cols-2 gap-1.5">
                {DEMO_TEAMS.map(team => {
                  const active = activePanel==="home" ? homeTeam.id===team.id : awayTeam.id===team.id;
                  return (
                    <button key={team.id} onClick={() => selectTeam(team, activePanel)}
                      className={`flex items-center gap-1.5 p-2 rounded-lg border text-xs font-medium transition-all ${
                        active
                          ? (activePanel==="home" ? "border-grass-500 bg-grass-500/10 text-grass-300" : "border-amber-500 bg-amber-500/10 text-amber-300")
                          : "border-white/10 hover:border-white/30 text-chalk-400"
                      }`}>
                      <img src={team.logo} className="w-5 h-5 object-contain" alt="" onError={e=>e.target.style.display="none"}/>
                      <span className="truncate">{team.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Search & player list */}
            <div className="glass flex flex-col" style={{maxHeight:420}}>
              <SidebarDroppable>
                <div className="px-3 pt-3 pb-2 border-b border-white/5 flex items-center gap-2">
                  <Users size={11} className="text-grass-400 shrink-0"/>
                  <span className="text-white text-[10px] font-bold uppercase tracking-wider flex-1">Starting XI</span>
                  <span className="text-chalk-700 text-[9px]">{Object.keys(activePanel==="home"?homeSlots:awaySlots).length}/11 placed</span>
                </div>
                <div className="px-2 py-1.5 border-b border-white/5">
                  <div className="flex items-center gap-1.5 bg-white/5 rounded px-2 py-1">
                    <Search size={10} className="text-chalk-600"/>
                    <input value={search} onChange={e=>setSearch(e.target.value)}
                      placeholder="Search..." className="bg-transparent text-white text-xs w-full focus:outline-none placeholder:text-chalk-700"/>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1 pb-1">
                  {benchAvailable.length > 0 && (
                    <div>
                      {benchAvailable.map(p => <SidebarPlayer key={p.id} player={p}/>)}
                    </div>
                  )}
                  {benchAvailable.length === 0 && (
                    <div className="py-6 text-center opacity-40">
                      <p className="text-chalk-600 text-[10px]">All starters on pitch</p>
                    </div>
                  )}
                </div>
              </SidebarDroppable>
            </div>

            {/* Substitutes bench */}
            <div className="glass p-3">
              <SidebarDroppable>
                <p className="text-chalk-600 text-[9px] font-mono uppercase tracking-widest mb-2 flex items-center gap-1">
                  <ChevronDown size={10}/> Substitutes
                </p>
                <div className="space-y-0.5">
                  {subs.map(p => (
                    <SidebarPlayer key={p.id} player={p} />
                  ))}
                </div>
              </SidebarDroppable>
            </div>
          </div>
        </div>
      </div>
    </DndContext>
  );
}
