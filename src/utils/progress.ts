import type { Arc } from "../types";

export interface ArcEpisodeProgress {
  watched: number;
  total: number;
}

export function getStoredEpisode(rawValue: string | null): number {
  if (!rawValue) return 0;

  const parsed = Number.parseInt(rawValue, 10);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0;
}

export function isEpisodeWatched(currentEpisode: number, episode: number): boolean {
  return episode < currentEpisode;
}

export function isArcComplete(currentEpisode: number, arc: Arc): boolean {
  return arc.endEp <= currentEpisode;
}

export function isArcInProgress(currentEpisode: number, arc: Arc): boolean {
  return arc.startEp <= currentEpisode && arc.endEp > currentEpisode;
}

export function getArcEpisodeProgress(currentEpisode: number, arc: Arc): ArcEpisodeProgress {
  const total = arc.endEp - arc.startEp + 1;
  const watched = Math.min(Math.max(currentEpisode - arc.startEp + 1, 0), total);

  return { watched, total };
}
