import { motion } from "framer-motion";

interface ProgressHeaderProps {
  total: number;
  watchedEps: number;
}

function MiniPirateShip() {
  return (
    <svg viewBox="0 0 60 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="36" height="24">
      {/* Hull */}
      <path d="M5 26 Q30 34 55 26 L50 32 Q30 38 10 32 Z" fill="#4a2c0a" />
      <path d="M10 32 Q30 37 50 32 L47 35 Q30 39 13 35 Z" fill="#3a200a" />
      {/* Deck */}
      <rect x="9" y="24" width="42" height="3" rx="1" fill="#6b3d12" />
      {/* Main mast */}
      <rect x="28" y="5" width="2.5" height="20" rx="0.5" fill="#5a3a10" />
      {/* Fore mast */}
      <rect x="17" y="9" width="2" height="16" rx="0.5" fill="#5a3a10" />
      {/* Main sail */}
      <path d="M30.5 6 L45 11 L45 21 L30.5 21 Z" fill="rgba(220,200,160,0.9)" stroke="rgba(180,150,100,0.5)" strokeWidth="0.5" />
      {/* Fore sail */}
      <path d="M19 10 L30 13 L30 22 L19 22 Z" fill="rgba(220,200,160,0.85)" stroke="rgba(180,150,100,0.5)" strokeWidth="0.5" />
      {/* Jolly Roger flag */}
      <path d="M30.5 2 L40 0.5 L40 7 L30.5 7 Z" fill="#1a1a1a" />
      {/* Skull */}
      <ellipse cx="35" cy="3.5" rx="2" ry="1.7" fill="white" />
      <circle cx="33.8" cy="3.2" r="0.6" fill="#1a1a1a" />
      <circle cx="36.2" cy="3.2" r="0.6" fill="#1a1a1a" />
      <rect x="33.5" y="4.5" width="3" height="1" rx="0.3" fill="white" />
      {/* Cannon ports */}
      <circle cx="18" cy="28" r="1.2" fill="#2a1a05" />
      <circle cx="30" cy="28.5" r="1.2" fill="#2a1a05" />
      <circle cx="42" cy="28" r="1.2" fill="#2a1a05" />
    </svg>
  );
}

export default function ProgressHeader({ total, watchedEps }: ProgressHeaderProps) {
  const pct = total === 0 ? 0 : Math.round((watchedEps / total) * 100);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 backdrop-blur-md bg-black/40 border-t border-white/10 px-4 py-3">
      <div className="max-w-2xl mx-auto flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs text-white/60 mb-1">
            <span className="font-semibold text-amber-400">
              🏴‍☠️ {watchedEps} / {total} eps complete
            </span>
          </div>

          {/* Progress bar with ship */}
          <div className="relative" style={{ paddingTop: "28px" }}>
            {/* Pirate ship riding the bar */}
            <motion.div
              className="absolute"
              style={{ bottom: "-4px", zIndex: 10 }}
              initial={{ left: "0%" }}
              animate={{ left: `${pct}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity }}
                style={{ marginLeft: "-16px" }}
              >
                <MiniPirateShip />
              </motion.div>
            </motion.div>

            <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: "linear-gradient(90deg, #0ea5e9, #06b6d4, #0284c7)",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              />
            </div>
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
