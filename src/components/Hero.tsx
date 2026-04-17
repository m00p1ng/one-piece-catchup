import { motion } from "framer-motion";

interface HeroProps {
  totalArcs: number;
  completedArcs: number;
}

interface StatProps {
  value: number;
  label: string;
  color: string;
}

export default function Hero({ totalArcs, completedArcs }: HeroProps) {
  const remaining = totalArcs - completedArcs;

  return (
    <div className="relative pt-20 pb-16 px-4 text-center overflow-hidden">
      {/* Floating orbs */}
      <div
        className="absolute top-8 left-1/4 w-64 h-64 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(245,158,11,0.08) 0%, transparent 70%)",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        className="absolute top-16 right-1/4 w-48 h-48 rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(139,92,246,0.07) 0%, transparent 70%)",
          animation: "float 8s ease-in-out infinite reverse",
        }}
      />

      {/* Straw hat icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
        className="text-7xl mb-6 inline-block"
        style={{ filter: "drop-shadow(0 0 20px rgba(245,158,11,0.5))" }}
      >
        🌊
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="text-xs font-bold tracking-[0.3em] text-amber-500/70 uppercase mb-3">
          Your Journey to
        </div>
        <h1
          className="text-5xl sm:text-6xl font-black tracking-tight mb-2"
          style={{
            background: "linear-gradient(135deg, #fbbf24, #f97316, #ef4444)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          One Piece
        </h1>
        <h2 className="text-2xl sm:text-3xl font-bold text-white/80 mb-6">
          Catch-Up Plan
        </h2>

        <p className="text-white/50 text-sm max-w-md mx-auto leading-relaxed mb-8">
          1000+ episodes of adventure, friendship, and dreams. Mark your progress arc by arc
          and sail toward the Grand Line.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6">
          <Stat value={totalArcs} label="Total Arcs" color="#f59e0b" />
          <div className="w-px h-8 bg-white/10" />
          <Stat value={completedArcs} label="Completed" color="#10b981" />
          <div className="w-px h-8 bg-white/10" />
          <Stat value={remaining} label="Remaining" color="#8b5cf6" />
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-4 left-1/2 -translate-x-1/2"
      >
        <div
          className="text-white/30 text-xs flex flex-col items-center gap-1"
          style={{ animation: "bounce 2s infinite" }}
        >
          <span>scroll to explore</span>
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

function Stat({ value, label, color }: StatProps) {
  return (
    <motion.div
      key={value}
      initial={{ scale: 1 }}
      animate={{ scale: [1, 1.1, 1] }}
      transition={{ duration: 0.3 }}
      className="text-center"
    >
      <div
        className="text-2xl font-black"
        style={{ color }}
      >
        {value}
      </div>
      <div className="text-xs text-white/40 mt-0.5">{label}</div>
    </motion.div>
  );
}
