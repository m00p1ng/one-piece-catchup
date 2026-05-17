import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface CompletionCelebrationProps {
  show: boolean;
}

const CONFETTI_COLORS = ["#fbbf24", "#ef4444", "#8b5cf6", "#10b981", "#3b82f6"];

export default function CompletionCelebration({ show }: CompletionCelebrationProps) {
  const [confetti] = useState(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      rotate: Math.random() * 720 - 360,
      x: Math.random() * 200 - 100,
      duration: Math.random() * 2 + 1.5,
      delay: Math.random() * 0.5,
    }))
  );

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
        >
          <div className="text-center">
            <div className="text-8xl mb-4" style={{ animation: "bounce 0.5s infinite" }}>
              🏴‍☠️
            </div>
            <div
              className="text-4xl font-black"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #f97316)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              You Found It!
            </div>
            <div className="text-white/70 mt-2">The One Piece was real all along</div>
          </div>
          {confetti.map((piece) => (
            <motion.div
              key={piece.id}
              className="absolute w-2 h-2 rounded-sm"
              style={{
                background: CONFETTI_COLORS[piece.id % CONFETTI_COLORS.length],
                left: `${piece.left}%`,
                top: "-10px",
              }}
              animate={{
                top: "110%",
                rotate: piece.rotate,
                x: piece.x,
              }}
              transition={{
                duration: piece.duration,
                delay: piece.delay,
                ease: "linear",
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
