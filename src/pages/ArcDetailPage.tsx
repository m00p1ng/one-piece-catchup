import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, Check } from "lucide-react";
import { findArc, findArcByEp } from "../data/arcs";
import { useHideWatched } from "../hooks/useHideWatched";
import { useProgress } from "../hooks/useProgress";
import ArcThumbnail from "../components/ArcThumbnail";
import EpisodeList from "../components/EpisodeList";
import ProgressBar from "../components/ProgressBar";
import NotFoundState from "../components/NotFoundState";

const UNDO_DURATION = 5000;

export default function ArcDetailPage() {
  const { arcId } = useParams<{ arcId: string }>();
  const result = findArc(arcId ?? "");
  const {
    currentEpisode,
    setCurrentEpisode,
    isArcComplete,
    isEpisodeWatched,
    getArcEpisodeProgress,
  } = useProgress();

  const [hideWatched, setHideWatched] = useHideWatched();

  const [undoPrevEp, setUndoPrevEp] = useState<number | null>(null);
  const [undoProgress, setUndoProgress] = useState(100);
  const undoTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const undoStartRef = useRef<number>(0);

  useEffect(() => () => { if (undoTimerRef.current) clearInterval(undoTimerRef.current); }, []);

  const showUndoToast = useCallback((prevEp: number) => {
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    undoStartRef.current = Date.now();
    setUndoPrevEp(prevEp);
    setUndoProgress(100);
    undoTimerRef.current = setInterval(() => {
      const pct = Math.max(0, 1 - (Date.now() - undoStartRef.current) / UNDO_DURATION);
      setUndoProgress(pct * 100);
      /* v8 ignore next 4 -- timeout expiry is visual cleanup; undo action covers behavior */
      if (pct <= 0) {
        clearInterval(undoTimerRef.current!);
        setUndoPrevEp(null);
      }
    }, 50);
  }, []);

  const handleUndoClick = useCallback(() => {
    if (undoTimerRef.current) clearInterval(undoTimerRef.current);
    if (undoPrevEp !== null) setCurrentEpisode(undoPrevEp);
    setUndoPrevEp(null);
  }, [setCurrentEpisode, undoPrevEp]);

  const handleSetCurrentEpisode = useCallback((ep: number) => {
    const isFirstSet = currentEpisode === 0;
    if (undoPrevEp !== null) {
      showUndoToast(undoPrevEp);
    } else if (!isFirstSet) {
      const currentArcId = findArcByEp(currentEpisode)?.arc.id;
      const newArcId = findArcByEp(ep)?.arc.id;
      const isDifferentArc = currentArcId !== newArcId;
      const isJump = ep > currentEpisode + 10;
      if (isDifferentArc || isJump) {
        showUndoToast(currentEpisode);
      }
    }
    setCurrentEpisode(ep);
  }, [currentEpisode, setCurrentEpisode, showUndoToast, undoPrevEp]);

  useEffect(() => {
    if (!currentEpisode) return;
    const timer = setTimeout(() => {
      const el = document.getElementById(`ep-${currentEpisode}`);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 400);
    return () => clearTimeout(timer);
  }, [currentEpisode]);

  const arc = result?.arc;
  const saga = result?.saga;

  const arcComplete = arc ? isArcComplete(arc) : false;
  const { watched, total } = arc ? getArcEpisodeProgress(arc) : { watched: 0, total: 0 };
  const pct = total === 0 ? 0 : Math.round((watched / total) * 100);

  if (!result || !arc || !saga) {
    return <NotFoundState message="Arc not found" />;
  }

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-2xl mx-auto px-4 pb-24 " style={{ backdropFilter: "blur(8px)", paddingTop: "env(safe-area-inset-top)" }}>
        {/* Arc header */}
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

          {/* Saga badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{saga.icon}</span>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: saga.color + "aa" }}>
              {saga.name}
            </span>
          </div>

          {/* Thumbnail + title */}
          <div className="flex gap-5 mb-5">
            <div className="relative shrink-0 w-32">
              <ArcThumbnail arc={arc} sagaColor={saga.color} size="detail" />
              <AnimatePresence>
                {arcComplete && (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.4, rotate: -15 }}
                    animate={{ opacity: 1, scale: 1, rotate: -12 }}
                    transition={{ type: "spring", stiffness: 300, damping: 18 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <span
                      className="px-2.5 py-1 rounded border-2 text-[10px] font-black tracking-widest uppercase select-none"
                      style={{
                        color: "#10b981",
                        borderColor: "#10b981",
                        background: "rgba(0,0,0,0.55)",
                        boxShadow: "0 0 12px rgba(16,185,129,0.25)",
                      }}
                    >
                      <Check className="h-4 w-4 inline" /> Complete
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 mb-1 flex-wrap">
                <h1 className="text-2xl font-black text-white">{arc.name}</h1>
                {arc.rating != null && (
                  <span className="text-sm font-bold text-amber-400 mt-1 flex-shrink-0">
                    ★ {arc.rating.toFixed(1)}
                  </span>
                )}
              </div>
              <div className="text-sm text-white/40 font-mono">
                <span>Ep {arc.episodes}</span>
                <span> · </span>
                <span style={{ color: saga.color + "cc" }}>{watched}/{total}</span>
              </div>

              {/* Progress */}
              <div className="flex items-baseline gap-3">
                <div className="flex-1">
                  <ProgressBar pct={pct} color={saga.color} />
                </div>
                <span className="text-sm font-black flex-shrink-0 mb-4" style={{ color: saga.color }}>
                  {pct}%
                </span>
              </div>

              <p className="text-sm text-white/55 leading-relaxed">{arc.description}</p>
            </div>
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {arc.villain && arc.villain !== "None" && (
              <div
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full"
                style={{
                  background: `${saga.color}12`,
                  border: `1px solid ${saga.color}33`,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <span style={{ color: saga.color }}>⚡</span>
                <span className="text-white/40">Villain:</span>
                <span className="font-semibold">{arc.villain}</span>
              </div>
            )}
            {arc.mustWatch && (
              <div
                className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold"
                style={{
                  background: `${saga.color}18`,
                  border: `1px solid ${saga.color}44`,
                  color: saga.color,
                }}
              >
                ★ Must Watch
              </div>
            )}
          </div>

          {/* Highlight quote */}
          {arc.highlight && (
            <div
              className="rounded-xl px-4 py-3 text-sm leading-relaxed mb-6"
              style={{
                background: `${saga.color}0d`,
                borderLeft: `3px solid ${saga.color}77`,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              <span style={{ color: saga.color }} className="font-bold">✦ </span>
              {arc.highlight}
            </div>
          )}
        </motion.div>

        {/* Divider */}
        <div
          className="h-px mb-6"
          style={{ background: `linear-gradient(90deg, ${saga.color}55, transparent)` }}
        />

        <EpisodeList
          arc={arc}
          sagaColor={saga.color}
          currentEpisode={currentEpisode}
          watched={watched}
          total={total}
          isEpisodeWatched={isEpisodeWatched}
          hideWatched={hideWatched}
          onHideWatchedChange={setHideWatched}
          onSetCurrentEpisode={handleSetCurrentEpisode}
        />
      </main>

      {/* Undo toast */}
      <AnimatePresence>
        {undoPrevEp !== null && (
          <motion.div
            key="undo-toast"
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[min(calc(100vw-2rem),360px)]"
          >
            <div
              className="rounded-2xl overflow-hidden shadow-2xl"
              style={{
                background: "rgba(18,18,24,0.96)",
                border: "1px solid rgba(255,255,255,0.12)",
                backdropFilter: "blur(16px)",
              }}
            >
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1 text-sm text-white/80 font-medium">
                  Moved to <span className="text-white font-bold">Ep. {currentEpisode}</span>
                </div>
                <button
                  onClick={handleUndoClick}
                  className="text-sm font-bold px-3 py-1 rounded-lg transition-colors"
                  style={{ color: "#fbbf24", background: "rgba(251,191,36,0.12)" }}
                >
                  Undo
                </button>
              </div>
              {/* Countdown progress bar */}
              <div className="h-0.5 bg-white/8">
                <div
                  className="h-full transition-none"
                  style={{
                    width: `${undoProgress}%`,
                    background: "linear-gradient(90deg, #fbbf24, #f59e0b)",
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
