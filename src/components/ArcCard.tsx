import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import cn from "classnames";
import ArcThumbnail from "./ArcThumbnail";
import ProgressBar from "./ProgressBar";
import type { Arc } from "../types";

interface ArcCardProps {
  arc: Arc;
  sagaColor: string;
  isComplete: boolean;
  isInProgress: boolean;
  progressPct: number;
  index: number;
}

export default function ArcCard({ arc, sagaColor, isComplete, isInProgress, progressPct, index }: ArcCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-colors duration-300",
        isComplete
          ? "border-white/10 bg-white/2"
          : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
      )}
      style={{
        boxShadow: isComplete ? `0 0 0 1px ${sagaColor}33, 0 2px 16px ${sagaColor}0f` : undefined,
      }}
    >
      {/* Subtle tinted overlay when complete */}
      {isComplete && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${sagaColor}08, transparent 60%)` }}
        />
      )}

      <Link to={`/arc/${arc.id}`} className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-14 h-14">
            <ArcThumbnail arc={arc} sagaColor={sagaColor} size="card" />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <h3
              className={cn(
                "font-bold text-sm leading-snug transition-colors duration-200",
                isComplete
                  ? "text-white/35 line-through decoration-white/20"
                  : "text-white hover:text-amber-300"
              )}
            >
              {arc.name}
            </h3>
            {arc.mustWatch && !isComplete && (
              <span
                className="text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 leading-none"
                style={{
                  background: `${sagaColor}1a`,
                  color: sagaColor,
                  border: `1px solid ${sagaColor}40`,
                }}
              >
                ★
              </span>
            )}
          </div>

          <span className="text-[11px] text-white/35 font-mono mb-1 mr-2">Ep {arc.episodes}</span>
          {arc.rating != null && (
            <span className={cn(
              "text-[11px] font-bold shrink-0",
              isComplete
                ? "text-amber-400/30"
                : "text-amber-400"
            )}>
              ★ {arc.rating.toFixed(1)}
            </span>
          )}

          {!isComplete && arc.description && (
            <p className="text-xs text-white/40 leading-relaxed line-clamp-1">{arc.description}</p>
          )}

          {/* In-progress bar */}
          {isInProgress && (
            <div className="mt-1.5">
              <ProgressBar pct={progressPct} color={sagaColor} />
            </div>
          )}
        </div>

        {/* Status indicator */}
        <div className="flex-shrink-0 ml-1">
          {isComplete ? (
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: sagaColor }}
            >
              <motion.svg viewBox="0 0 12 10" className="w-3 h-3" fill="none">
                <motion.path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.25 }}
                />
              </motion.svg>
            </div>
          ) : isInProgress ? (
            <div
              className="w-6 h-6 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: sagaColor }}
            >
              <div
                className="w-2 h-2 rounded-full"
                style={{ background: sagaColor }}
              />
            </div>
          ) : (
            <div
              className="w-6 h-6 rounded-full border-2"
              style={{ borderColor: "rgba(255,255,255,0.15)" }}
            />
          )}
        </div>
      </Link>
    </motion.div>
  );
}
