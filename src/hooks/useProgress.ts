import { useState, useEffect } from "react";
import type { Arc } from "../types";

const CURRENT_EP_KEY = "one-piece-current-ep";

export function useProgress() {
  const [currentEpisode, setCurrentEpisodeState] = useState<number>(() => {
    try {
      const stored = localStorage.getItem(CURRENT_EP_KEY);
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem(CURRENT_EP_KEY, String(currentEpisode));
  }, [currentEpisode]);

  function setCurrentEpisode(ep: number) {
    setCurrentEpisodeState(ep);
  }

  function isEpisodeWatched(epNum: number): boolean {
    return epNum <= currentEpisode;
  }

  function isArcComplete(arc: Arc): boolean {
    return arc.endEp <= currentEpisode;
  }

  function isArcInProgress(arc: Arc): boolean {
    return arc.startEp <= currentEpisode && arc.endEp > currentEpisode;
  }

  function getArcEpisodeProgress(arc: Arc): { watched: number; total: number } {
    const total = arc.endEp - arc.startEp + 1;
    const watched = Math.min(Math.max(currentEpisode - arc.startEp + 1, 0), total);
    return { watched, total };
  }

  return {
    currentEpisode,
    setCurrentEpisode,
    isEpisodeWatched,
    isArcComplete,
    isArcInProgress,
    getArcEpisodeProgress,
  };
}
