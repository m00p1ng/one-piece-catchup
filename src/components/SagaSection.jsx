import { motion } from "framer-motion";
import ArcCard from "./ArcCard";

export default function SagaSection({ saga, checkedArcs, onToggle }) {
  const completedCount = saga.arcs.filter((a) => checkedArcs[a.id]).length;
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
      <div className="flex items-center gap-4 mb-6">
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
            <h2 className="text-xl font-black text-white tracking-tight">{saga.name}</h2>
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
          <div className="flex items-center gap-3 mt-0.5">
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
        <div className="hidden sm:block w-24">
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
      </div>

      {/* Saga description */}
      <p className="text-sm text-white/40 mb-5 pl-16 leading-relaxed">
        {saga.description}
      </p>

      {/* Separator line with glow */}
      <div
        className="h-px mb-6 rounded-full"
        style={{
          background: `linear-gradient(90deg, ${saga.color}66, transparent)`,
        }}
      />

      {/* Arc cards */}
      <div className="grid gap-3">
        {saga.arcs.map((arc, i) => (
          <ArcCard
            key={arc.id}
            arc={arc}
            sagaColor={saga.color}
            checked={!!checkedArcs[arc.id]}
            onToggle={() => onToggle(arc)}
            index={i}
          />
        ))}
      </div>
    </motion.section>
  );
}
