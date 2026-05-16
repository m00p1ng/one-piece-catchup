import { AnimatePresence, motion } from "framer-motion";
import ArcCard from "./ArcCard";
import type { Arc } from "../types";
import { useProgress } from "../hooks/useProgress";

interface ArcListProps {
  arcs: Arc[];
  sagaColor: string;
  hideWatched?: boolean;
  emptyMessage?: string;
  emptyClassName?: string;
}

export default function ArcList({
  arcs,
  sagaColor,
  hideWatched = false,
  emptyMessage = "All arcs watched",
  emptyClassName = "text-sm text-white/25 italic",
}: ArcListProps) {
  const { isArcComplete, isArcInProgress, getArcEpisodeProgress } = useProgress();
  const visibleArcs = hideWatched ? arcs.filter((arc) => !isArcComplete(arc)) : arcs;

  return (
    <div className="grid gap-3">
      <AnimatePresence initial={false}>
        {visibleArcs.length === 0 ? (
          <motion.p
            key="empty"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={emptyClassName}
          >
            {emptyMessage}
          </motion.p>
        ) : (
          visibleArcs.map((arc, index) => {
            const { watched, total } = getArcEpisodeProgress(arc);
            const progressPct = total === 0 ? 0 : Math.round((watched / total) * 100);

            return (
              <motion.div
                key={arc.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut", delay: index * 0.03 }}
                style={{ overflow: "hidden" }}
              >
                <ArcCard
                  arc={arc}
                  sagaColor={sagaColor}
                  isComplete={isArcComplete(arc)}
                  isInProgress={isArcInProgress(arc)}
                  progressPct={progressPct}
                  index={index}
                />
              </motion.div>
            );
          })
        )}
      </AnimatePresence>
    </div>
  );
}
