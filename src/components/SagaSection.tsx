import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ArcCard from "./ArcCard";
import type { Arc, Saga } from "../types";

interface SagaSectionProps {
  saga: Saga;
  checkedArcs: Record<string, boolean>;
  onToggle: (arc: Arc) => void;
  hideWatched?: boolean;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export default function SagaSection({ saga, checkedArcs, onToggle, hideWatched = false, open, onOpenChange }: SagaSectionProps) {
  const completedCount = saga.arcs.filter((a) => checkedArcs[a.id]).length;
  const visibleArcs = hideWatched ? saga.arcs.filter((a) => !checkedArcs[a.id]) : saga.arcs;
  const isAllDone = completedCount === saga.arcs.length;

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="mb-16"
    >
      {/* Saga header */}
      <button
        onClick={() => onOpenChange(!open)}
        className="w-full flex items-center gap-4 mb-6 cursor-pointer text-left"
      >
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg"
          style={{
            background: `linear-gradient(135deg, ${saga.color}33, ${saga.color}11)`,
            border: `1px solid ${saga.color}44`,
            boxShadow: `0 4px 20px ${saga.color}22`,
          }}
        >
          {saga.icon}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to={`/saga/${saga.id}`}
              onClick={(e) => e.stopPropagation()}
              className="text-xl font-black text-white tracking-tight hover:text-amber-300 transition-colors"
            >
              {saga.name}
            </Link>
            {saga.rating != null && (
              <span className="flex items-center gap-1 text-sm font-bold text-amber-400">
                ★ {saga.rating.toFixed(1)}
              </span>
            )}
            {isAllDone && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              >
                ✓ Complete
              </motion.span>
            )}
          </div>
          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
            <span className="text-sm text-white/40 italic">{saga.subtitle}</span>
            <span className="text-xs text-white/30">·</span>
            <span className="text-xs text-white/30 font-mono">Ep {saga.episodes}</span>
            <span className="text-xs text-white/30">·</span>
            <span
              className="text-xs font-semibold"
              style={{ color: saga.color + "cc" }}
            >
              {completedCount}/{saga.arcs.length} arcs
            </span>
          </div>
        </div>

        {/* Mini progress bar */}
        <div className="hidden sm:block w-24 flex-shrink-0">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: saga.color }}
              initial={{ width: 0 }}
              animate={{
                width: `${(completedCount / saga.arcs.length) * 100}%`,
              }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Chevron */}
        <motion.span
          animate={{ rotate: open ? 0 : -90 }}
          transition={{ duration: 0.2 }}
          className="text-4xl text-white/50 flex-shrink-0"
        >
          ▾
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            {/* Saga description */}
            <p className="text-sm text-white/40 mb-8 pl-16 leading-relaxed">
              {saga.description}
            </p>

            {/* Arc cards */}
            <div className="grid gap-3">
              <AnimatePresence initial={false}>
                {visibleArcs.length === 0 ? (
                  <motion.p
                    key="empty"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                    className="text-sm text-white/25 pl-16 italic"
                  >
                    All arcs watched
                  </motion.p>
                ) : (
                  visibleArcs.map((arc, i) => (
                    <motion.div
                      key={arc.id}
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: "auto", marginBottom: 0 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut", delay: i * 0.03 }}
                      style={{ overflow: "hidden" }}
                    >
                      <ArcCard
                        arc={arc}
                        sagaColor={saga.color}
                        checked={!!checkedArcs[arc.id]}
                        onToggle={() => onToggle(arc)}
                        index={i}
                      />
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        className="h-px mt-8 rounded-full"
        style={{ background: `linear-gradient(90deg, ${saga.color}66, transparent)` }}
      />
    </motion.section>
  );
}
