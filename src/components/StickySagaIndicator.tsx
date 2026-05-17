import { AnimatePresence, motion } from "framer-motion";
import type { Saga } from "../types";

interface StickySagaIndicatorProps {
  saga: Saga | null;
  completedArcs: number;
}

export default function StickySagaIndicator({ saga, completedArcs }: StickySagaIndicatorProps) {
  const totalArcs = saga?.arcs.length ?? 0;
  const progressPct = totalArcs === 0 ? 0 : (completedArcs / totalArcs) * 100;

  return (
    <AnimatePresence>
      {saga && (
        <motion.div
          key={`sticky-saga-${saga.id}`}
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
            background: `linear-gradient(135deg, ${saga.color}18, rgba(0,0,0,0.6))`,
            borderBottom: `1px solid ${saga.color}33`,
            paddingTop: "env(safe-area-inset-top)",
          }}
        >
          <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center text-base flex-shrink-0"
              style={{
                background: `linear-gradient(135deg, ${saga.color}33, ${saga.color}11)`,
                border: `1px solid ${saga.color}44`,
              }}
            >
              {saga.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-black text-white tracking-tight truncate">
                  {saga.name}
                </span>
                <span className="text-xs font-mono text-white/30">Ep {saga.episodes}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs font-semibold" style={{ color: saga.color + "cc" }}>
                {completedArcs}/{totalArcs} arcs
              </span>
              <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    background: saga.color,
                    width: `${progressPct}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
