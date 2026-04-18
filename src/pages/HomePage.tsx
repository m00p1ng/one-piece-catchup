import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sagas } from "../data/arcs";
import { useProgress } from "../hooks/useProgress";
import ProgressHeader from "../components/ProgressHeader";
import Hero from "../components/Hero";
import SagaSection from "../components/SagaSection";

export default function HomePage() {
  const { arcs, toggleArc } = useProgress();
  const [hideWatched, setHideWatched] = useState(false);

  const allArcs = useMemo(() => sagas.flatMap((s) => s.arcs), []);
  const totalArcs = allArcs.length;
  const completedArcs = allArcs.filter((a) => arcs[a.id]).length;
  const totalEps = useMemo(() => allArcs.reduce((sum, a) => sum + a.count, 0), [allArcs]);
  const watchedEps = allArcs
    .filter((a) => arcs[a.id])
    .reduce((sum, a) => sum + a.count, 0);

  const isAllDone = completedArcs === totalArcs;

  const [showHeader, setShowHeader] = useState(false);
  const [activeSagaId, setActiveSagaId] = useState<string | null>(null);

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
    ? (sagas.find((s) => s.id === activeSagaId) ?? sagas[0] ?? null)
    : null;

  return (
    <div className="min-h-screen text-white">
      <Hero totalArcs={totalArcs} completedArcs={completedArcs} watchedEps={watchedEps} totalEps={totalEps} />

      <main className="max-w-2xl mx-auto px-4 pb-32 " style={{ backdropFilter: "blur(8px)" }}>
        <div className="mt-4">
          {/* Hide watched toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setHideWatched((v) => !v)}
              className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-full border transition-all duration-150 font-semibold"
              style={
                hideWatched
                  ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24", borderColor: "rgba(251,191,36,0.3)" }
                  : { color: "rgba(255,255,255,0.4)", borderColor: "rgba(255,255,255,0.1)" }
              }
            >
              {hideWatched ? "👁 Show watched" : "👁 Hide watched"}
            </button>
          </div>

          {sagas.map((saga) => (
            <div key={saga.id} id={`saga-${saga.id}`}>
              <SagaSection
                saga={saga}
                checkedArcs={arcs}
                onToggle={toggleArc}
                hideWatched={hideWatched}
              />
            </div>
          ))}
        </div>

        <div className="text-center py-8 text-white/20 text-xs">
          <div className="text-2xl mb-2">☠️</div>
          <p>The One Piece is real.</p>
        </div>
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

      <AnimatePresence>
        {showHeader && (
          <motion.div
            key="progress-header"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            style={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50 }}
          >
            <ProgressHeader total={totalEps} watchedEps={watchedEps} />
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
            {Array.from({ length: 30 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 rounded-sm"
                style={{
                  background: ["#fbbf24", "#ef4444", "#8b5cf6", "#10b981", "#3b82f6"][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: "-10px",
                }}
                animate={{
                  top: "110%",
                  rotate: Math.random() * 720 - 360,
                  x: Math.random() * 200 - 100,
                }}
                transition={{
                  duration: Math.random() * 2 + 1.5,
                  delay: Math.random() * 0.5,
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
