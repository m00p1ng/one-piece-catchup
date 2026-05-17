import { useCallback, useState } from "react";
import type { KeyboardEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import cn from "classnames";
import { Check } from "lucide-react";
import HideWatchedButton from "./HideWatchedButton";
import type { Arc, Landmark } from "../types";

interface EpisodeItem {
  ep: number;
  landmark: Landmark | undefined;
}

interface EpisodeListProps {
  arc: Arc;
  sagaColor: string;
  currentEpisode: number;
  watched: number;
  total: number;
  isEpisodeWatched: (ep: number) => boolean;
  hideWatched: boolean;
  onHideWatchedChange: (hideWatched: boolean) => void;
  onSetCurrentEpisode: (ep: number) => void;
}

interface EpisodeRowProps {
  ep: number;
  landmark: Landmark | undefined;
  sagaColor: string;
  thumbnailEmoji: string;
  watched: boolean;
  isCurrent: boolean;
  onSetCurrent: (ep: number) => void;
  index: number;
}

export default function EpisodeList({
  arc,
  sagaColor,
  currentEpisode,
  watched,
  total,
  isEpisodeWatched,
  hideWatched,
  onHideWatchedChange,
  onSetCurrentEpisode,
}: EpisodeListProps) {
  const [showOnlyNotes, setShowOnlyNotes] = useState(false);
  const episodes = getEpisodeItems(arc);
  const hasNoteEpisodes = episodes.some(({ landmark }) => landmark?.note);
  const visibleEpisodes = episodes
    .filter(({ landmark }) => !showOnlyNotes || landmark?.note)
    .filter(({ ep }) => !hideWatched || !isEpisodeWatched(ep));
  const allWatched = total > 0 && watched === total;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-black text-white">
          Episodes
          <span className="ml-2 text-sm font-normal text-white/30">
            ({total})
          </span>
        </h2>
      </div>

      <p className="text-xs text-white/30 mb-4 italic">
        Tap an episode to mark it as your current watching point
      </p>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-xs text-white/35">
          {arc.landmarks && arc.landmarks.length > 0 && (
            <>
              <span
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{ background: sagaColor }}
              />
              <span>Highlighted episode</span>
            </>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasNoteEpisodes && (
            <button
              onClick={() => setShowOnlyNotes((value) => !value)}
              className="text-xs px-3 py-1.5 rounded-lg font-semibold transition-all duration-150 flex-shrink-0"
              style={
                showOnlyNotes
                  ? {
                    background: `${sagaColor}18`,
                    color: sagaColor,
                    border: `1px solid ${sagaColor}33`,
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

          <HideWatchedButton
            hideWatched={hideWatched}
            rounded="lg"
            onToggle={() => onHideWatchedChange(!hideWatched)}
          />
        </div>
      </div>

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
            visibleEpisodes.map(({ ep, landmark }, index) => (
              <motion.div
                key={ep}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.18, ease: "easeInOut", delay: index * 0.008 }}
                style={{ overflow: "hidden" }}
              >
                <EpisodeRow
                  ep={ep}
                  landmark={landmark}
                  sagaColor={sagaColor}
                  thumbnailEmoji={arc.thumbnailEmoji}
                  watched={isEpisodeWatched(ep)}
                  isCurrent={ep === currentEpisode}
                  onSetCurrent={onSetCurrentEpisode}
                  index={index}
                />
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {allWatched && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            className="mt-6 p-5 rounded-2xl text-center"
            style={{
              background: `linear-gradient(135deg, ${sagaColor}20, ${sagaColor}0a)`,
              border: `1px solid ${sagaColor}44`,
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
  );
}

function getEpisodeItems(arc: Arc): EpisodeItem[] {
  const episodes: EpisodeItem[] = [];

  for (let ep = arc.startEp; ep <= arc.endEp; ep++) {
    episodes.push({ ep, landmark: arc.landmarks?.find((landmark) => landmark.ep === ep) });
  }

  return episodes;
}

function EpisodeRow({ ep, landmark, sagaColor, thumbnailEmoji, watched, isCurrent, onSetCurrent, index }: EpisodeRowProps) {
  const [titleExpanded, setTitleExpanded] = useState(false);
  const handleClick = useCallback(() => onSetCurrent(ep), [ep, onSetCurrent]);
  /* v8 ignore next 5 -- keyboard activation is the same state transition as click activation */
  const handleKeyDown = useCallback((event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;

    event.preventDefault();
    onSetCurrent(ep);
  }, [ep, onSetCurrent]);

  return (
    <motion.div
      id={`ep-${ep}`}
      role="button"
      tabIndex={0}
      aria-label={`Mark episode ${ep} as current`}
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.008, 0.3) }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
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

      <div
        className="hidden sm:block text-sm font-mono font-bold text-center shrink-0 w-16"
        style={{ color: isCurrent ? sagaColor : watched ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.35)" }}
      >
        <span style={{ color: isCurrent ? sagaColor : landmark?.note ? sagaColor : undefined }}>
          Ep.{ep}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        {landmark ? (
          <div>
            <div
              className={cn(
                "text-sm font-semibold leading-snug cursor-text",
                watched && !isCurrent ? "text-white/40 line-through" : "text-white/80",
                !titleExpanded && "line-clamp-2"
              )}
              onClick={(event) => { event.stopPropagation(); setTitleExpanded((value) => !value); }}
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

      {landmark?.note && !watched && !isCurrent && (
        <div
          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
          style={{ background: sagaColor }}
        />
      )}
    </motion.div>
  );
}
