import { useCallback } from "react";
import type { Arc } from "../types";
import { useStoredState } from "./useStoredState";
import {
  getArcEpisodeProgress as getArcEpisodeProgressForEpisode,
  getStoredEpisode,
  isArcComplete as isArcCompleteForEpisode,
  isArcInProgress as isArcInProgressForEpisode,
  isEpisodeWatched as isEpisodeWatchedForEpisode,
} from "../utils/progress";

const CURRENT_EP_KEY = "one-piece-current-ep";

export function useProgress() {
  const [currentEpisode, setCurrentEpisode] = useStoredState(CURRENT_EP_KEY, 0, {
    parse: getStoredEpisode,
  });

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
