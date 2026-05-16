import { useCallback, useState, useEffect } from "react";
import type { Arc } from "../types";
import {
  getArcEpisodeProgress as getArcEpisodeProgressForEpisode,
  getStoredEpisode,
  isArcComplete as isArcCompleteForEpisode,
  isArcInProgress as isArcInProgressForEpisode,
  isEpisodeWatched as isEpisodeWatchedForEpisode,
} from "../utils/progress";

const CURRENT_EP_KEY = "one-piece-current-ep";

export function useProgress() {
  const [currentEpisode, setCurrentEpisodeState] = useState<number>(() => {
    try {
      return getStoredEpisode(localStorage.getItem(CURRENT_EP_KEY));
    } catch {
      return 0;
    }
  });

  useEffect(() => {
    localStorage.setItem(CURRENT_EP_KEY, String(currentEpisode));
  }, [currentEpisode]);

  const setCurrentEpisode = useCallback((ep: number) => {
    setCurrentEpisodeState(ep);
  }, []);

  const isEpisodeWatched = useCallback((epNum: number): boolean => {
    return isEpisodeWatchedForEpisode(currentEpisode, epNum);
  }, [currentEpisode]);

  const isArcComplete = useCallback((arc: Arc): boolean => {
    return isArcCompleteForEpisode(currentEpisode, arc);
  }, [currentEpisode]);

  const isArcInProgress = useCallback((arc: Arc): boolean => {
    return isArcInProgressForEpisode(currentEpisode, arc);
  }, [currentEpisode]);

  const getArcEpisodeProgress = useCallback((arc: Arc): { watched: number; total: number } => {
    return getArcEpisodeProgressForEpisode(currentEpisode, arc);
  }, [currentEpisode]);

  return {
    currentEpisode,
    setCurrentEpisode,
    isEpisodeWatched,
    isArcComplete,
    isArcInProgress,
    getArcEpisodeProgress,
  };
}
