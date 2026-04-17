import { useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { findArc } from "../data/arcs";
import { useProgress } from "../hooks/useProgress";
import ArcThumbnail from "../components/ArcThumbnail";
import WaveBackground from "../components/WaveBackground";
import ProgressBarWithShip from "../components/ProgressBarWithShip";
import type { Landmark } from "../types";

interface EpisodeRowProps {
  ep: number;
  landmark: Landmark | undefined;
  sagaColor: string;
  thumbnailEmoji: string;
  watched: boolean;
  onToggle: () => void;
  index: number;
}

export default function ArcDetailPage() {
  const { arcId } = useParams<{ arcId: string }>();
  const result = findArc(arcId ?? "");
  const {
    toggleArc,
    toggleEpisode,
    isArcComplete,
    isEpisodeWatched,
    getArcEpisodeProgress,
    markAllEpisodes,
  } = useProgress();

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-white/50">Arc not found</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const { arc, saga } = result;
  const arcComplete = isArcComplete(arc.id);
  const { watched, total } = getArcEpisodeProgress(arc);
  const pct = total === 0 ? 0 : Math.round((watched / total) * 100);

  const [showOnlyNotes, setShowOnlyNotes] = useState(false);
  const [hideWatched, setHideWatched] = useState(false);

  const episodes = useMemo(() => {
    const list: { ep: number; landmark: Landmark | undefined }[] = [];
    for (let i = arc.startEp; i <= arc.endEp; i++) {
      const landmark = arc.landmarks?.find((l) => l.ep === i);
      list.push({ ep: i, landmark });
    }
    return list;
  }, [arc]);

  const hasNoteEpisodes = episodes.some(({ landmark }) => landmark?.note);
  const visibleEpisodes = episodes
    .filter(({ landmark }) => !showOnlyNotes || landmark?.note)
    .filter(({ ep }) => !hideWatched || !isEpisodeWatched(arc.id, ep));

  const allWatched = total > 0 && watched === total;

  return (
    <div className="min-h-screen text-white">
      <WaveBackground />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span className="font-semibold truncate" style={{ color: saga.color }}>
                {arc.name}
              </span>
              <span>{watched}/{total} watched</span>
            </div>
            <ProgressBarWithShip pct={pct} color={saga.color} />
          </div>

          <span className="text-sm font-black flex-shrink-0" style={{ color: saga.color }}>
            {pct}%
          </span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-24">
        {/* Arc header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-8 pb-6"
        >
          {/* Saga badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-lg">{saga.icon}</span>
            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: saga.color + "aa" }}>
              {saga.name}
            </span>
          </div>

          {/* Thumbnail + title */}
          <div className="flex gap-5 mb-5">
            <div className="flex-shrink-0 w-32">
              <ArcThumbnail arc={arc} sagaColor={saga.color} size="detail" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-black text-white mb-1">{arc.name}</h1>
              <div className="text-sm text-white/40 font-mono mb-3">
                Episodes {arc.episodes} · {arc.count} eps
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

          {/* Arc-level completion toggle */}
          <div
            className="flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all duration-200"
            style={{
              background: arcComplete ? `${saga.color}15` : "rgba(255,255,255,0.03)",
              borderColor: arcComplete ? `${saga.color}55` : "rgba(255,255,255,0.1)",
            }}
            onClick={() => toggleArc(arc)}
          >
            <div>
              <div className="text-sm font-bold text-white">Mark Arc Complete</div>
              <div className="text-xs text-white/40 mt-0.5">
                Overrides individual episode tracking
              </div>
            </div>
            <div
              className="w-7 h-7 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
              style={{
                borderColor: arcComplete ? saga.color : "rgba(255,255,255,0.2)",
                background: arcComplete ? saga.color : "transparent",
              }}
            >
              {arcComplete && (
                <svg viewBox="0 0 12 10" className="w-3.5 h-3.5" fill="none">
                  <path
                    d="M1 5L4.5 8.5L11 1"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </div>
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
                ({total} total)
              </span>
            </h2>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideWatched((v) => !v)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150"
                style={
                  hideWatched
                    ? { background: "rgba(251,191,36,0.12)", color: "#fbbf24", border: "1px solid rgba(251,191,36,0.3)" }
                    : { color: "rgba(255,255,255,0.4)", border: "1px solid rgba(255,255,255,0.1)" }
                }
              >
                {hideWatched ? "👁 Show" : "👁 Hide"}
              </button>
              <button
                onClick={() => markAllEpisodes(arc, true)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150"
                style={{
                  background: `${saga.color}18`,
                  color: saga.color,
                  border: `1px solid ${saga.color}33`,
                }}
              >
                All watched
              </button>
              <button
                onClick={() => markAllEpisodes(arc, false)}
                className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 text-white/40 border border-white/10 hover:border-white/20"
              >
                Clear
              </button>
            </div>
          </div>

          {/* Landmark legend + note filter */}
          {arc.landmarks && arc.landmarks.length > 0 && (
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs text-white/35">
                <span
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ background: saga.color }}
                />
                <span>Highlighted episodes are landmark moments</span>
              </div>
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
            </div>
          )}

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
                      watched={isEpisodeWatched(arc.id, ep)}
                      onToggle={() => toggleEpisode(arc, ep)}
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

function EpisodeRow({ ep, landmark, sagaColor, thumbnailEmoji, watched, onToggle, index }: EpisodeRowProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.008, 0.3) }}
      onClick={onToggle}
      className={`flex items-center gap-3 px-3 py-2 rounded-xl cursor-pointer transition-all duration-150 group ${
        landmark?.note
          ? "border"
          : "hover:bg-white/[0.04]"
      }`}
      style={
        landmark?.note
          ? {
              background: watched ? `${sagaColor}0c` : `${sagaColor}08`,
              borderColor: watched ? `${sagaColor}33` : `${sagaColor}22`,
            }
          : {}
      }
    >
      {/* Thumbnail */}
      <div
        className="relative w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden transition-opacity duration-150"
        style={{
          background: `linear-gradient(135deg, ${sagaColor}28 0%, ${sagaColor}10 100%)`,
          border: `1px solid ${landmark?.note ? sagaColor + "33" : sagaColor + "18"}`,
          opacity: watched ? 0.45 : 1,
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

      {/* Watched indicator */}
      <div
        className="w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-all duration-150"
        style={{
          borderColor: watched ? sagaColor : "rgba(255,255,255,0.15)",
          background: watched ? sagaColor : "transparent",
        }}
      >
        {watched && (
          <svg viewBox="0 0 10 8" className="w-2.5 h-2.5" fill="none">
            <path
              d="M1 4L3.5 6.5L9 1"
              stroke="white"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>

      {/* Episode number */}
      <div
        className="text-xs font-mono font-bold flex-shrink-0 w-14"
        style={{ color: watched ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.35)" }}
      >
        <span style={{ color: landmark?.note ? sagaColor : undefined }}>
          Ep {ep}
        </span>
      </div>

      {/* Title / landmark info */}
      <div className="flex-1 min-w-0">
        {landmark ? (
          <div>
            <div
              className={`text-xs font-semibold leading-snug ${
                watched ? "text-white/40 line-through" : "text-white/80"
              }`}
            >
              {landmark.title}
            </div>
            {landmark.note && (
              <div
                className="text-[10px] mt-0.5 font-medium"
                style={{ color: watched ? "rgba(255,255,255,0.25)" : sagaColor + "bb" }}
              >
                {landmark.note}
              </div>
            )}
          </div>
        ) : (
          <div
            className={`text-xs ${
              watched ? "text-white/25" : "text-white/30 group-hover:text-white/45"
            }`}
          >
            Episode {ep}
          </div>
        )}
      </div>

      {/* Landmark dot */}
      {landmark?.note && !watched && (
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: sagaColor }}
        />
      )}
    </motion.div>
  );
}
