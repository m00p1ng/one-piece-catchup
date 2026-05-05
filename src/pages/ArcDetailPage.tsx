import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import cn from "classnames";
import { ChevronLeft, Check, Eye, EyeOff, Play } from "lucide-react";
import { findArc } from "../data/arcs";
import { useProgress } from "../hooks/useProgress";
import ArcThumbnail from "../components/ArcThumbnail";
import ProgressBar from "../components/ProgressBar";
import type { Landmark } from "../types";

interface EpisodeRowProps {
  ep: number;
  landmark: Landmark | undefined;
  sagaColor: string;
  thumbnailEmoji: string;
  watched: boolean;
  isCurrent: boolean;
  onSetCurrent: () => void;
  index: number;
}

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

  const [showOnlyNotes, setShowOnlyNotes] = useState(false);
  const [hideWatched, setHideWatched] = useState(() => localStorage.getItem("hideWatched") === "true");

  const arc = result?.arc;
  const saga = result?.saga;

  const arcComplete = arc ? isArcComplete(arc) : false;
  const { watched, total } = arc ? getArcEpisodeProgress(arc) : { watched: 0, total: 0 };
  const pct = total === 0 ? 0 : Math.round((watched / total) * 100);

  const episodes = useMemo(() => {
    if (!arc) return [];
    const list: { ep: number; landmark: Landmark | undefined }[] = [];
    for (let i = arc.startEp; i <= arc.endEp; i++) {
      const landmark = arc.landmarks?.find((l) => l.ep === i);
      list.push({ ep: i, landmark });
    }
    return list;
  }, [arc]);

  if (!result || !arc || !saga) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-white/50">Arc not found</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            <ChevronLeft className="w-4 h-4 inline" />
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  const hasNoteEpisodes = episodes.some(({ landmark }) => landmark?.note);
  const visibleEpisodes = episodes
    .filter(({ landmark }) => !showOnlyNotes || landmark?.note)
    .filter(({ ep }) => !hideWatched || !isEpisodeWatched(ep));

  const allWatched = total > 0 && watched === total;

  return (
    <div className="min-h-screen text-white">
      <main className="max-w-2xl mx-auto px-4 pb-24 " style={{ backdropFilter: "blur(8px)" }}>
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
            {/* Current episode indicator */}
            {currentEpisode >= arc.startEp && currentEpisode <= arc.endEp && (
              <div
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-bold"
                style={{
                  background: `${saga.color}18`,
                  border: `1px solid ${saga.color}44`,
                  color: saga.color,
                }}
              >
                <Play className="w-3 h-3" />
                Now watching Ep.{currentEpisode}
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

        {/* Episodes section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-black text-white">
              Episodes
              <span className="ml-2 text-sm font-normal text-white/30">
                ({total})
              </span>
            </h2>
          </div>

          {/* Hint */}
          <p className="text-xs text-white/30 mb-4 italic">
            Tap an episode to mark it as your current watching point
          </p>

          {/* Landmark legend + note filter */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-white/35">
              {arc.landmarks && arc.landmarks.length > 0 && (
                <>
                  <span
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: saga.color }}
                  />
                  <span>Highlighted episode</span>
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {hasNoteEpisodes && (
                <button
                  onClick={() => setShowOnlyNotes((v) => !v)}
                  className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 flex-shrink-0"
                  style={
                    showOnlyNotes
                      ? {
                        background: `${saga.color}18`,
                        color: saga.color,
                        border: `1px solid ${saga.color}33`,
                      }
                      : {
                        color: "rgba(255,255,255,0.4)",
                        border: "1px solid rgba(255,255,255,0.1)",
                      }
                  }
                >
                  Key only
                </button>
              )}

              <button
                onClick={() => setHideWatched((v) => { localStorage.setItem("hideWatched", String(!v)); return !v; })}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 flex items-center"
                style={
                  hideWatched
                    ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }
                    : { color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {hideWatched ? <><Eye className="h-4 w-4 mr-1" />Show</> : <><EyeOff className="h-4 w-4 mr-1" /> Hide</>}
              </button>
            </div>
          </div>

          {/* Episode grid */}
          <div className="grid gap-1.5">
            <AnimatePresence initial={false}>
              {visibleEpisodes.length === 0 ? (
                <motion.p
                  key="empty"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                  className="text-sm text-white/25 italic py-2"
                >
                  All episodes watched
                </motion.p>
              ) : (
                visibleEpisodes.map(({ ep, landmark }, i) => (
                  <motion.div
                    key={ep}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.18, ease: "easeInOut", delay: i * 0.008 }}
                    style={{ overflow: "hidden" }}
                  >
                    <EpisodeRow
                      ep={ep}
                      landmark={landmark}
                      sagaColor={saga.color}
                      thumbnailEmoji={arc.thumbnailEmoji}
                      watched={isEpisodeWatched(ep)}
                      isCurrent={ep === currentEpisode}
                      onSetCurrent={() => setCurrentEpisode(ep)}
                      index={i}
                    />
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {/* Completion celebration */}
          <AnimatePresence>
            {allWatched && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
                className="mt-6 p-5 rounded-2xl text-center"
                style={{
                  background: `linear-gradient(135deg, ${saga.color}20, ${saga.color}0a)`,
                  border: `1px solid ${saga.color}44`,
                }}
              >
                <div className="text-3xl mb-2">🎉</div>
                <div className="font-black text-white text-lg">{arc.name} Complete!</div>
                <div className="text-sm text-white/50 mt-1">
                  All {total} episodes watched
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function EpisodeRow({ ep, landmark, sagaColor, thumbnailEmoji, watched, isCurrent, onSetCurrent, index }: EpisodeRowProps) {
  const [titleExpanded, setTitleExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.008, 0.3) }}
      onClick={onSetCurrent}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group",
        isCurrent
          ? "border-2"
          : landmark?.note
            ? "border"
            : "hover:bg-white/4"
      )}
      style={
        isCurrent
          ? {
            background: `${sagaColor}18`,
            borderColor: sagaColor,
            boxShadow: `0 0 12px ${sagaColor}33`,
          }
          : landmark?.note
            ? {
              background: watched ? `${sagaColor}0c` : `${sagaColor}08`,
              borderColor: watched ? `${sagaColor}33` : `${sagaColor}22`,
            }
            : {}
      }
    >
      {/* Thumbnail */}
      <div
        className="relative w-10 h-10 rounded-lg hidden sm:flex items-center justify-center flex-shrink-0 overflow-hidden transition-opacity duration-150"
        style={{
          background: `linear-gradient(135deg, ${sagaColor}28 0%, ${sagaColor}10 100%)`,
          border: `1px solid ${landmark?.note ? sagaColor + "33" : sagaColor + "18"}`,
          opacity: watched && !isCurrent ? 0.45 : 1,
        }}
      >
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(-45deg, transparent, transparent 5px, ${sagaColor}06 5px, ${sagaColor}06 10px)`,
          }}
        />
        <span className="relative z-10 text-base select-none" style={{ filter: `drop-shadow(0 0 4px ${sagaColor}66)` }}>
          {thumbnailEmoji}
        </span>
      </div>

      {/* Watch indicator / current indicator */}
      <div
        className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          borderColor: isCurrent ? sagaColor : watched ? sagaColor : "rgba(255,255,255,0.15)",
          background: isCurrent ? "transparent" : watched ? sagaColor : "transparent",
        }}
      >
        {isCurrent ? (
          <div className="w-2 h-2 rounded-full" style={{ background: sagaColor }} />
        ) : watched ? (
          <Check className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
        ) : null}
      </div>

      {/* Episode number */}
      <div
        className="hidden sm:block text-sm font-mono font-bold text-center shrink-0 w-16"
        style={{ color: isCurrent ? sagaColor : watched ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.35)" }}
      >
        <span style={{ color: isCurrent ? sagaColor : landmark?.note ? sagaColor : undefined }}>
          Ep.{ep}
        </span>
      </div>

      {/* Title / landmark info */}
      <div className="flex-1 min-w-0">
        {landmark ? (
          <div>
            <div
              className={cn(
                "text-sm font-semibold leading-snug cursor-text",
                watched && !isCurrent ? "text-white/40 line-through" : "text-white/80",
                !titleExpanded && "line-clamp-2"
              )}
              onClick={(e) => { e.stopPropagation(); setTitleExpanded((v) => !v); }}
            >
              {landmark.rating != null && (
                <span className="text-xs font-bold text-amber-400/80 mr-1">
                  ★ {landmark.rating.toFixed(1)}
                </span>
              )}
              <span className="sm:hidden text-xs font-mono font-bold mr-1" style={{ color: isCurrent ? sagaColor : landmark?.note ? sagaColor : "rgba(255,255,255,0.35)" }}>
                Ep.{ep}
              </span>
              {landmark.title}
            </div>
            {landmark.note && (
              <div
                className="text-xs mt-0.5 font-medium"
                style={{ color: watched && !isCurrent ? "rgba(255,255,255,0.25)" : sagaColor + "bb" }}
              >
                {landmark.note}
              </div>
            )}
          </div>
        ) : (
          <div
            className={cn(
              "text-sm",
              watched && !isCurrent ? "text-white/25" : isCurrent ? "text-white/80" : "text-white/30 group-hover:text-white/45"
            )}
          >
            Episode {ep}
          </div>
        )}
      </div>

      {/* Current badge */}
      {isCurrent && (
        <div
          className="text-[9px] font-black px-1.5 py-0.5 rounded flex-shrink-0 tracking-widest uppercase"
          style={{
            background: sagaColor,
            color: "white",
          }}
        >
          NOW
        </div>
      )}

      {/* Landmark dot (only when not current and not watched) */}
      {landmark?.note && !watched && !isCurrent && (
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: sagaColor }}
        />
      )}
    </motion.div>
  );
}
