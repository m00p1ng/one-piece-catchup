import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sagas } from "../data/arcs";
import { useProgress } from "../hooks/useProgress";
import Hero from "../components/Hero";
import SagaSection from "../components/SagaSection";
import { Eye, EyeOff } from "lucide-react";

export default function HomePage() {
  const { arcs, toggleArc } = useProgress();
  const [hideWatched, setHideWatched] = useState(() => localStorage.getItem("hideWatched") === "true");

  const allArcs = useMemo(() => sagas.flatMap((s) => s.arcs), []);
  const totalArcs = allArcs.length;
  const completedArcs = allArcs.filter((a) => arcs[a.id]).length;
  const totalEps = useMemo(() => allArcs.reduce((sum, a) => sum + a.count, 0), [allArcs]);
  const watchedEps = allArcs
    .filter((a) => arcs[a.id])
    .reduce((sum, a) => sum + a.count, 0);

  const isAllDone = completedArcs === totalArcs;

  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      rotate: Math.random() * 720 - 360,
      x: Math.random() * 200 - 100,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 0.5,
    }))
  );

  const [showHeader, setShowHeader] = useState(false);
  const [activeSagaId, setActiveSagaId] = useState<string | null>(null);

  const [openSagas, setOpenSagas] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sagas.map((s) => [s.id, s.arcs.some((a) => !arcs[a.id])]))
  );


  useEffect(() => {
    const onScroll = () => setShowHeader(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      let activeId: string | null = null;
      for (const saga of sagas) {
        const el = document.getElementById(`saga-${saga.id}`);
        if (el && el.getBoundingClientRect().top < 0) {
          activeId = saga.id;
        } else {
          break;
        }
      }
      setActiveSagaId(activeId);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const firstIncompleteSagaId = useMemo(
    () =>
      completedArcs > 0
        ? (sagas.find((s) => s.arcs.some((a) => !arcs[a.id]))?.id ?? null)
        : null,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!firstIncompleteSagaId) return;
    const el = document.getElementById(`saga-${firstIncompleteSagaId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [firstIncompleteSagaId]);

  const activeSaga = showHeader
    ? (() => {
      const s = sagas.find((s) => s.id === activeSagaId) ?? sagas[0] ?? null;
      return s && openSagas[s.id] ? s : null;
    })()
    : null;

  return (
    <div className="min-h-screen text-white">
      <Hero totalArcs={totalArcs} completedArcs={completedArcs} watchedEps={watchedEps} totalEps={totalEps} />

      <main className="max-w-2xl mx-auto px-4 pb-32 " style={{ backdropFilter: "blur(8px)" }}>
        <div className="mt-4">
          {/* Hide watched toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setHideWatched((v) => { localStorage.setItem("hideWatched", String(!v)); return !v; })}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all duration-150 font-semibold"
              style={
                hideWatched
                  ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" }
                  : { color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }
              }
            >
              {hideWatched ? <><Eye className="h-4 w-4"/>Show</> : <><EyeOff className="h-4 w-4"/>Hide</>}
            </button>
          </div>

          <AnimatePresence initial={false}>
            {sagas.filter((saga) => !hideWatched || saga.arcs.some((a) => !arcs[a.id])).map((saga) => (
              <motion.div
                key={saga.id}
                id={`saga-${saga.id}`}
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <SagaSection
                  saga={saga}
                  checkedArcs={arcs}
                  onToggle={toggleArc}
                  hideWatched={hideWatched}
                  open={openSagas[saga.id] ?? true}
                  onOpenChange={(v) => setOpenSagas((prev) => ({ ...prev, [saga.id]: v }))}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <footer className="mt-16 border-t border-white/5 pt-10 pb-8">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4" style={{ filter: "drop-shadow(0 0 16px rgba(251,191,36,0.4))" }}>☠️</div>
            <div
              className="text-lg font-black tracking-tight mb-1"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              The One Piece is Real.
            </div>
            <p className="text-white/30 text-xs">Keep sailing. The adventure never ends.</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8 text-center">
            {[
              { label: "Arcs Tracked", value: `${totalArcs}` },
              { label: "Episodes", value: `${totalEps}+` },
              { label: "Years Running", value: "25+" },
            ].map((stat) => (
              <div key={stat.label} className="rounded-xl py-3 px-2" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="text-xl font-black" style={{ color: "#fbbf24" }}>{stat.value}</div>
                <div className="text-white/30 text-xs mt-0.5">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-1.5 text-white/40 text-xs">
            <span>Built for One Piece fans</span>
            <span>·</span>
            <a
              href="https://github.com/m00p1ng/one-piece-catchup"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-white/40"
            >
              GitHub
            </a>
          </div>
        </footer>
      </main>

      {/* Sticky saga indicator */}
      <AnimatePresence>
        {activeSaga && (
          <motion.div
            key={`sticky-saga-${activeSaga.id}`}
            initial={{ y: "-100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-100%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              backdropFilter: "blur(16px)",
              background: `linear-gradient(135deg, ${activeSaga.color}18, rgba(0,0,0,0.6))`,
              borderBottom: `1px solid ${activeSaga.color}33`,
            }}
          >
            <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${activeSaga.color}33, ${activeSaga.color}11)`,
                  border: `1px solid ${activeSaga.color}44`,
                }}
              >
                {activeSaga.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-black text-white tracking-tight truncate">
                    {activeSaga.name}
                  </span>
                  <span className="text-xs font-mono text-white/30">Ep {activeSaga.episodes}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs font-semibold" style={{ color: activeSaga.color + "cc" }}>
                  {activeSaga.arcs.filter((a) => arcs[a.id]).length}/{activeSaga.arcs.length} arcs
                </span>
                <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      background: activeSaga.color,
                      width: `${(activeSaga.arcs.filter((a) => arcs[a.id]).length / activeSaga.arcs.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* All done celebration */}
      <AnimatePresence>
        {isAllDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
          >
            <div className="text-center">
              <div className="text-8xl mb-4" style={{ animation: "bounce 0.5s infinite" }}>
                🏴‍☠️
              </div>
              <div
                className="text-4xl font-black"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #f97316)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                You Found It!
              </div>
              <div className="text-white/70 mt-2">The One Piece was real all along</div>
            </div>
            {confetti.map((c) => (
              <motion.div
                key={c.id}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  background: ["#fbbf24", "#ef4444", "#8b5cf6", "#10b981", "#3b82f6"][c.id % 5],
                  left: `${c.left}%`,
                  top: "-10px",
                }}
                animate={{
                  top: "110%",
                  rotate: c.rotate,
                  x: c.x,
                }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  ease: "linear",
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
