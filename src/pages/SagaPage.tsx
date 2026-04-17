import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { findSaga } from "../data/arcs";
import { useProgress } from "../hooks/useProgress";
import WaveBackground from "../components/WaveBackground";
import ArcCard from "../components/ArcCard";

export default function SagaPage() {
  const { sagaId } = useParams<{ sagaId: string }>();
  const saga = findSaga(sagaId ?? "");
  const { arcs, toggleArc } = useProgress();

  if (!saga) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        <div className="text-center">
          <div className="text-4xl mb-4">🌊</div>
          <p className="text-white/50">Saga not found</p>
          <Link to="/" className="mt-4 inline-block text-amber-400 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = saga.arcs.filter((a) => arcs[a.id]).length;
  const pct = Math.round((completedCount / saga.arcs.length) * 100);

  return (
    <div className="min-h-screen text-white">
      <WaveBackground />

      {/* Sticky top bar */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-black/50 border-b border-white/10 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors text-sm"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between text-xs text-white/40 mb-1">
              <span className="font-semibold truncate" style={{ color: saga.color }}>
                {saga.name}
              </span>
              <span>{completedCount}/{saga.arcs.length} arcs</span>
            </div>
            <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: saga.color }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>
          </div>

          <span className="text-sm font-black flex-shrink-0" style={{ color: saga.color }}>
            {pct}%
          </span>
        </div>
      </div>

      <main className="max-w-2xl mx-auto px-4 pb-24">
        {/* Saga header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="pt-8 pb-6"
        >
          <div className="flex items-center gap-4 mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${saga.color}33, ${saga.color}11)`,
                border: `1px solid ${saga.color}44`,
                boxShadow: `0 4px 20px ${saga.color}22`,
              }}
            >
              {saga.icon}
            </div>
            <div>
              <h1 className="text-2xl font-black text-white tracking-tight">{saga.name}</h1>
              <p className="text-sm text-white/40 italic">{saga.subtitle}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mb-4 text-xs text-white/30 font-mono">
            <span>Ep {saga.episodes}</span>
            <span>·</span>
            <span style={{ color: saga.color + "cc" }}>{completedCount}/{saga.arcs.length} arcs complete</span>
          </div>

          <p className="text-sm text-white/50 leading-relaxed">{saga.description}</p>
        </motion.div>

        <div
          className="h-px mb-8"
          style={{ background: `linear-gradient(90deg, ${saga.color}55, transparent)` }}
        />

        {/* Arc list */}
        <div className="grid gap-3">
          {saga.arcs.map((arc, i) => (
            <ArcCard
              key={arc.id}
              arc={arc}
              sagaColor={saga.color}
              checked={!!arcs[arc.id]}
              onToggle={() => toggleArc(arc)}
              index={i}
            />
          ))}
        </div>
      </main>
    </div>
  );
}
