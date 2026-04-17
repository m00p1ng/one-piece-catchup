import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { sagas } from "./data/arcs";
import WaveBackground from "./components/WaveBackground";
import ProgressHeader from "./components/ProgressHeader";
import Hero from "./components/Hero";
import SagaSection from "./components/SagaSection";

const STORAGE_KEY = "one-piece-progress";

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function App() {
  const [checked, setChecked] = useState(loadProgress);
  const [showConfetti, setShowConfetti] = useState(false);

  const allArcs = useMemo(() => sagas.flatMap((s) => s.arcs), []);
  const totalArcs = allArcs.length;
  const completedArcs = allArcs.filter((a) => checked[a.id]).length;
  const watchedEps = allArcs
    .filter((a) => checked[a.id])
    .reduce((sum, a) => sum + a.count, 0);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(checked));
  }, [checked]);

  function toggleArc(arcId) {
    setChecked((prev) => {
      const next = { ...prev, [arcId]: !prev[arcId] };
      const nowDone = allArcs.filter((a) => next[a.id]).length;
      if (nowDone === allArcs.length) {
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 4000);
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen text-white font-sans">
      <WaveBackground />
      <ProgressHeader
        completed={completedArcs}
        total={totalArcs}
        watchedEps={watchedEps}
      />

      <main className="max-w-2xl mx-auto px-4 pb-32">
        <Hero totalArcs={totalArcs} completedArcs={completedArcs} />

        <div className="mt-4">
          {sagas.map((saga) => (
            <SagaSection
              key={saga.id}
              saga={saga}
              checkedArcs={checked}
              onToggle={toggleArc}
            />
          ))}
        </div>

        <div className="text-center py-8 text-white/20 text-xs">
          <div className="text-2xl mb-2">☠️</div>
          <p>The One Piece is real.</p>
        </div>
      </main>

      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
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
