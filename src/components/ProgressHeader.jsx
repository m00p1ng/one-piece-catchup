import { motion } from "framer-motion";
import { totalEpisodes } from "../data/arcs";

export default function ProgressHeader({ completed, total, watchedEps }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="sticky top-0 z-50 backdrop-blur-md bg-black/40 border-b border-white/10 px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center gap-4">
        {/* Ship emoji sailing */}
        <div className="flex-1">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span className="font-semibold text-amber-400">
              ⛵ {completed}/{total} arcs complete
            </span>
            <span className="text-white/40">
              ~{watchedEps.toLocaleString()} / {totalEpisodes.toLocaleString()} eps
            </span>
          </div>
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg, #f59e0b, #ef4444, #8b5cf6)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
            {/* Shimmer */}
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)",
                animation: "shimmer 2s infinite",
              }}
            />
          </div>
        </div>

        {/* Percentage badge */}
        <div className="text-right min-w-[3.5rem]">
          <motion.span
            key={pct}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-xl font-black text-amber-400"
          >
            {pct}%
          </motion.span>
        </div>
      </div>
    </div>
  );
}
