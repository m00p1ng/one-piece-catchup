import { motion } from "framer-motion";

export default function ArcCard({ arc, sagaColor, checked, onToggle, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onToggle}
      className={`relative cursor-pointer rounded-2xl border p-5 transition-all duration-300 select-none ${
        checked
          ? "border-white/20 bg-white/5"
          : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07] hover:border-white/20"
      }`}
      style={{
        boxShadow: checked
          ? `0 0 0 1px ${sagaColor}55, 0 4px 24px ${sagaColor}22`
          : "none",
      }}
    >
      {/* Completion overlay */}
      {checked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${sagaColor}10, transparent)`,
          }}
        />
      )}

      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="mt-0.5 flex-shrink-0">
          <motion.div
            animate={checked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors duration-200`}
            style={{
              borderColor: checked ? sagaColor : "rgba(255,255,255,0.25)",
              background: checked ? sagaColor : "transparent",
            }}
          >
            {checked && (
              <motion.svg
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }}
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

        <div className="flex-1 min-w-0">
          {/* Title row */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div>
              <h3
                className={`font-bold text-base leading-snug transition-colors duration-200 ${
                  checked ? "text-white/50 line-through decoration-white/30" : "text-white"
                }`}
              >
                {arc.name}
              </h3>
              <span className="text-xs text-white/40 font-mono">
                Ep {arc.episodes} · {arc.count} episodes
              </span>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              {arc.mustWatch && !checked && (
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${sagaColor}22`,
                    color: sagaColor,
                    border: `1px solid ${sagaColor}44`,
                  }}
                >
                  Must Watch
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          {!checked && (
            <p className="text-sm text-white/50 leading-relaxed mb-3">
              {arc.description}
            </p>
          )}

          {/* Highlight */}
          {!checked && arc.highlight && (
            <div
              className="text-xs rounded-lg px-3 py-2 leading-relaxed"
              style={{
                background: `${sagaColor}11`,
                borderLeft: `3px solid ${sagaColor}88`,
                color: "rgba(255,255,255,0.65)",
              }}
            >
              <span style={{ color: sagaColor }} className="font-semibold">
                ✦{" "}
              </span>
              {arc.highlight}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
