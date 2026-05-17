import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { sagas } from "../data/arcs";
import { useHideWatched } from "../hooks/useHideWatched";
import { useProgress } from "../hooks/useProgress";
import Hero from "../components/Hero";
import SagaSection from "../components/SagaSection";
import HideWatchedButton from "../components/HideWatchedButton";
import EpisodePreviewCard from "../components/EpisodePreviewCard";
import HomeFooter from "../components/HomeFooter";
import StickySagaIndicator from "../components/StickySagaIndicator";
import CompletionCelebration from "../components/CompletionCelebration";

export default function HomePage() {
  const navigate = useNavigate();
  const { currentEpisode, isArcComplete } = useProgress();
  const [hideWatched, setHideWatched] = useHideWatched();

  const allArcs = useMemo(() => sagas.flatMap((s) => s.arcs), []);
  const totalArcs = allArcs.length;
  const completedArcs = useMemo(() => allArcs.filter((a) => isArcComplete(a)).length, [allArcs, isArcComplete]);
  const totalEps = useMemo(() => allArcs.reduce((sum, a) => sum + a.count, 0), [allArcs]);
  const currentArc = useMemo(() => allArcs.find((a) => a.startEp <= currentEpisode && a.endEp >= currentEpisode) ?? null, [allArcs, currentEpisode]);

  const nextEpisode = currentEpisode + 1;
  const nextArc = useMemo(
    () => allArcs.find((a) => a.startEp <= nextEpisode && a.endEp >= nextEpisode) ?? null,
    [allArcs, nextEpisode]
  );

  const currentLandmark = useMemo(
    () => currentArc?.landmarks?.find((l) => l.ep === currentEpisode) ?? null,
    [currentArc, currentEpisode]
  );
  const nextLandmark = useMemo(
    () => nextArc?.landmarks?.find((l) => l.ep === nextEpisode) ?? null,
    [nextArc, nextEpisode]
  );

  const isAllDone = completedArcs === totalArcs;

  const [showHeader, setShowHeader] = useState(false);
  const [activeSagaId, setActiveSagaId] = useState<string | null>(null);

  const [openSagas, setOpenSagas] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(sagas.map((s) => [s.id, s.arcs.some((a) => !isArcComplete(a))]))
  );

  useEffect(() => {
    const onScroll = () => setShowHeader(window.scrollY > window.innerHeight * 0.8);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      let activeId: string | null = null;
      for (const saga of sagas) {
        const el = document.getElementById(`saga-${saga.id}`);
        if (!el) continue;
        /* v8 ignore next 3 -- sticky header scroll math is viewport-dependent */
        if (el.getBoundingClientRect().top < 0) {
          activeId = saga.id;
        } else {
          break;
        }
      }
      setActiveSagaId(activeId);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const firstIncompleteSagaId = useMemo(
    () =>
      completedArcs > 0
        ? (sagas.find((s) => s.arcs.some((a) => !isArcComplete(a)))?.id ?? null)
        : null,
    [completedArcs, isArcComplete]
  );

  useEffect(() => {
    if (!firstIncompleteSagaId) return;
    const el = document.getElementById(`saga-${firstIncompleteSagaId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [firstIncompleteSagaId]);

  const activeSaga = showHeader
    ? (() => {
      const visibleSagas = sagas.filter((s) => !hideWatched || s.arcs.some((a) => !isArcComplete(a)));
      return visibleSagas.find((s) => s.id === activeSagaId) ?? null;
    })()
    : null;
  const activeSagaCompletedArcs = activeSaga ? activeSaga.arcs.filter((a) => isArcComplete(a)).length : 0;

  return (
    <div className="min-h-screen text-white">
      <Hero
        totalArcs={totalArcs}
        completedArcs={completedArcs}
        currentEpisode={currentEpisode}
        totalEps={totalEps}
      />

      <main className="max-w-2xl mx-auto px-4 pb-32 " style={{ backdropFilter: "blur(8px)" }}>
        {currentEpisode > 0 && (
          <div className="mt-6 mb-2 grid grid-cols-2 gap-3">
            <EpisodePreviewCard
              label="Now"
              episode={currentEpisode}
              arc={currentArc}
              landmark={currentLandmark}
              accentColor="#fbbf24"
              backgroundColor="rgba(251,191,36,0.05)"
              borderColor="rgba(251,191,36,0.12)"
              onClick={() => currentArc && navigate(`/arc/${currentArc.id}`)}
            />

            <EpisodePreviewCard
              label="Next"
              episode={nextEpisode}
              arc={nextArc}
              landmark={nextLandmark}
              accentColor="#10b981"
              backgroundColor="rgba(16,185,129,0.04)"
              borderColor="rgba(16,185,129,0.12)"
              onClick={() => nextArc && navigate(`/arc/${nextArc.id}`)}
            />
          </div>
        )}

        <div className="mt-4">
          {/* Hide watched toggle */}
          <div className="flex justify-end mb-4">
            <HideWatchedButton hideWatched={hideWatched} onToggle={() => setHideWatched((value) => !value)} />
          </div>

          <AnimatePresence initial={false}>
            {sagas.filter((saga) => !hideWatched || saga.arcs.some((a) => !isArcComplete(a))).map((saga) => (
              <motion.div
                key={saga.id}
                id={`saga-${saga.id}`}
                initial={{ opacity: 0, height: 0, overflow: "hidden" }}
                animate={{ opacity: 1, height: "auto", overflow: "visible" }}
                exit={{ opacity: 0, height: 0, overflow: "hidden" }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
              >
                <SagaSection
                  saga={saga}
                  hideWatched={hideWatched}
                  open={openSagas[saga.id] ?? true}
                  onOpenChange={(v) => setOpenSagas((prev) => ({ ...prev, [saga.id]: v }))}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <HomeFooter totalArcs={totalArcs} totalEps={totalEps} />
      </main>

      <StickySagaIndicator saga={activeSaga} completedArcs={activeSagaCompletedArcs} />
      <CompletionCelebration show={isAllDone} />
    </div>
  );
}
