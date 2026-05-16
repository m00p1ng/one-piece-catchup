import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import { findSaga } from "../data/arcs";
import { useProgress } from "../hooks/useProgress";
import ArcList from "../components/ArcList";
import HideWatchedButton from "../components/HideWatchedButton";
import ProgressBar from "../components/ProgressBar";

export default function SagaPage() {
  const { sagaId } = useParams<{ sagaId: string }>();
  const saga = findSaga(sagaId ?? "");
  const { isArcComplete } = useProgress();
  const [hideWatched, setHideWatched] = useState(() => localStorage.getItem("hideWatched") === "true");

  if (!saga) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-white/50">Saga not found</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            <ChevronLeft className="w-4 h-4 inline" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = saga.arcs.filter((a) => isArcComplete(a)).length;
  const pct = Math.round((completedCount / saga.arcs.length) * 100);
  const isAllDone = completedCount === saga.arcs.length;

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-2xl mx-auto px-4 pb-24 " style={{ backdropFilter: "blur(8px)", paddingTop: "env(safe-area-inset-top)" }}>
        {/* Saga header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-8 pb-6"
        >
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm mb-6"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Link>

          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${saga.color}33, ${saga.color}11)`,
                border: `1px solid ${saga.color}44`,
                boxShadow: `0 4px 20px ${saga.color}22`,
              }}
            >
              {saga.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-0.5">
                <h1 className="text-2xl font-black text-white tracking-tight">{saga.name}</h1>
                {saga.rating != null && (
                  <span className="text-sm font-bold text-amber-400">
                    ★ {saga.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <p className="text-sm text-white/40 italic">{saga.subtitle}</p>
            </div>
            <AnimatePresence>
              {isAllDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 1.4, rotate: -15 }}
                  animate={{ opacity: 1, scale: 1, rotate: -12 }}
                  transition={{ type: "spring", stiffness: 300, damping: 18 }}
                  className="flex-shrink-0 px-3 py-1.5 rounded border-2 text-xs font-black tracking-widest uppercase select-none"
                  style={{
                    color: "#10b981",
                    borderColor: "#10b981",
                    boxShadow: "0 0 12px rgba(16,185,129,0.25)",
                    opacity: 0.9,
                  }}
                >
                  ✓ Complete
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-3 text-xs text-white/30 font-mono">
            <span>Episodes {saga.episodes}</span>
            <span>·</span>
            <span style={{ color: saga.color + "cc" }}>{completedCount}/{saga.arcs.length} completed</span>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="flex-1">
              <ProgressBar pct={pct} color={saga.color} />
            </div>
            <span className="text-sm font-black flex-shrink-0 mb-4" style={{ color: saga.color }}>
              {pct}%
            </span>
          </div>

          <p className="text-sm text-white/50 leading-relaxed">{saga.description}</p>
        </motion.div>

        <div
          className="h-px mb-8"
          style={{ background: `linear-gradient(90deg, ${saga.color}55, transparent)` }}
        />

        {/* Arc list */}
        <div className="flex justify-end mb-4">
          <HideWatchedButton
            hideWatched={hideWatched}
            onToggle={() => setHideWatched((value) => {
              localStorage.setItem("hideWatched", String(!value));
              return !value;
            })}
          />
        </div>
        <ArcList arcs={saga.arcs} sagaColor={saga.color} hideWatched={hideWatched} />
      </main>
    </div>
  );
}
