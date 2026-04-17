import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.15 } }}
      className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
        checked
          ? "border-white/15 bg-white/[0.03]"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06] hover:border-white/20"
      }`}
      style={{
        boxShadow: checked ? `0 0 0 1px ${sagaColor}44, 0 4px 20px ${sagaColor}15` : "none",
      }}
    >
      {checked && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${sagaColor}0a, transparent)`,
          }}
        />
      )}

      <div className="flex items-stretch gap-0">
        {/* Thumbnail — click goes to detail */}
        <Link
          to={`/arc/${arc.id}`}
          className="flex-shrink-0 p-3 group"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative">
            <ArcThumbnail arc={arc} sagaColor={sagaColor} size="card" />
            {/* Hover overlay */}
            <div
              className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
              style={{ background: "rgba(0,0,0,0.5)" }}
            >
              <span className="text-white text-xs font-semibold flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Details
              </span>
            </div>
          </div>
        </Link>

        {/* Content — click goes to detail */}
        <Link
          to={`/arc/${arc.id}`}
          className="flex-1 min-w-0 py-3 pr-3 flex flex-col justify-center group"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3
                className={`font-bold text-sm leading-snug transition-colors ${
                  checked ? "text-white/40 line-through decoration-white/25" : "text-white group-hover:text-amber-300"
                }`}
                style={{ transition: "color 0.15s" }}
              >
                {arc.name}
              </h3>
              <span className="text-[11px] text-white/35 font-mono">Ep {arc.episodes}</span>
            </div>
            {arc.mustWatch && !checked && (
              <span
                className="text-[10px] font-bold px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5"
                style={{
                  background: `${sagaColor}1a`,
                  color: sagaColor,
                  border: `1px solid ${sagaColor}44`,
                }}
              >
                ★
              </span>
            )}
          </div>

          {!checked && (
            <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{arc.description}</p>
          )}
        </Link>

        {/* Checkbox — independent toggle */}
        <div
          className="flex items-center pr-4 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        >
          <motion.div
            animate={checked ? { scale: [1, 1.25, 1] } : { scale: 1 }}
            transition={{ duration: 0.25 }}
            className="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200"
            style={{
              borderColor: checked ? sagaColor : "rgba(255,255,255,0.2)",
              background: checked ? sagaColor : "transparent",
            }}
          >
            {checked && (
              <motion.svg
                viewBox="0 0 12 10"
                className="w-3 h-3"
                fill="none"
              >
                <motion.path
                  d="M1 5L4.5 8.5L11 1"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.svg>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
