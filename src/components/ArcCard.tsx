import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import cn from "classnames";
import ArcThumbnail from "./ArcThumbnail";
import type { Arc } from "../types";

interface ArcCardProps {
  arc: Arc;
  sagaColor: string;
  checked: boolean;
  onToggle: () => void;
  index: number;
}

export default function ArcCard({ arc, sagaColor, checked, onToggle, index }: ArcCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      className={cn(
        "relative rounded-2xl border overflow-hidden transition-colors duration-300",
        checked
          ? "border-white/10 bg-white/2"
          : "border-white/10 bg-white/4 hover:border-white/20 hover:bg-white/6"
      )}
      style={{
        boxShadow: checked ? `0 0 0 1px ${sagaColor}33, 0 2px 16px ${sagaColor}0f` : undefined,
      }}
    >
      {/* Subtle tinted overlay when checked */}
      {checked && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: `linear-gradient(135deg, ${sagaColor}08, transparent 60%)` }}
        />
      )}

      <div className="flex items-center gap-3 p-3">
        {/* Thumbnail */}
        <Link
          to={`/arc/${arc.id}`}
          className="flex-shrink-0"
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-14 h-14">
            <ArcThumbnail arc={arc} sagaColor={sagaColor} size="card" />
          </div>
        </Link>

        {/* Content — clicking navigates to detail */}
        <Link
          to={`/arc/${arc.id}`}
          className="flex-1 min-w-0"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-2 mb-0.5">
            <h3
              className={cn(
                "font-bold text-sm leading-snug transition-colors duration-200",
                checked
                  ? "text-white/35 line-through decoration-white/20"
                  : "text-white hover:text-amber-300"
              )}
            >
              {arc.name}
            </h3>
            {arc.mustWatch && !checked && (
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
              checked
                ? "text-amber-400/30"
                : "text-amber-400"
            )}>
              ★ {arc.rating.toFixed(1)}
            </span>
          )}

          {!checked && arc.description && (
            <p className="text-xs text-white/40 leading-relaxed line-clamp-1">{arc.description}</p>
          )}
        </Link>

        {/* Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="flex-shrink-0 p-1 -mr-0.5 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          aria-label={checked ? "Mark as unwatched" : "Mark as watched"}
        >
          <motion.div
            animate={checked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
            style={{
              borderColor: checked ? sagaColor : "rgba(255,255,255,0.2)",
              background: checked ? sagaColor : "transparent",
            }}
          >
            {checked && (
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
            )}
          </motion.div>
        </button>
      </div>
    </motion.div>
  );
}
