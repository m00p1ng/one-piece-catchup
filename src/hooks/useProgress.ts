import { useState, useEffect } from "react";
import type { Arc } from "../types";

const ARC_KEY = "one-piece-arcs";
const EP_KEY = "one-piece-episodes";

function load(key: string): Record<string, boolean> {
  try {
    // Migrate from old key name
    if (key === ARC_KEY) {
      const legacy = localStorage.getItem("one-piece-progress");
      if (legacy && !localStorage.getItem(ARC_KEY)) {
        localStorage.setItem(ARC_KEY, legacy);
      }
    }
    return JSON.parse(localStorage.getItem(key) || "{}") as Record<string, boolean>;
  } catch {
    return {};
  }
}

export function useProgress() {
  const [arcs, setArcs] = useState<Record<string, boolean>>(() => load(ARC_KEY));
  const [episodes, setEpisodes] = useState<Record<string, boolean>>(() => load(EP_KEY));

  useEffect(() => {
    localStorage.setItem(ARC_KEY, JSON.stringify(arcs));
  }, [arcs]);

  useEffect(() => {
    localStorage.setItem(EP_KEY, JSON.stringify(episodes));
  }, [episodes]);

  function toggleArc(arc: Arc) {
    const newArcState = !arcs[arc.id];
    setArcs((prev) => ({ ...prev, [arc.id]: newArcState }));
    setEpisodes((prev) => {
      const next = { ...prev };
      for (let i = arc.startEp; i <= arc.endEp; i++) {
        const key = `${arc.id}:${i}`;
        if (newArcState) {
          next[key] = true;
        } else {
          delete next[key];
        }
      }
      return next;
    });
  }

  function toggleEpisode(arc: Arc, epNum: number) {
    let allWatched = false;
    setEpisodes((prev) => {
      const key = `${arc.id}:${epNum}`;
      const next = { ...prev, [key]: !prev[key] };
      if (arc.startEp && arc.endEp) {
        allWatched = Array.from(
          { length: arc.endEp - arc.startEp + 1 },
          (_, i) => arc.startEp + i
        ).every((ep) => !!next[`${arc.id}:${ep}`]);
      }
      return next;
    });
    setArcs((prev) => ({ ...prev, [arc.id]: allWatched }));
  }

  function isArcComplete(arcId: string): boolean {
    return !!arcs[arcId];
  }

  function isEpisodeWatched(arcId: string, epNum: number): boolean {
    return !!episodes[`${arcId}:${epNum}`];
  }

  function getArcEpisodeProgress(arc: Arc): { watched: number; total: number } {
    if (!arc.startEp || !arc.endEp) return { watched: 0, total: 0 };
    const total = arc.endEp - arc.startEp + 1;
    let watched = 0;
    for (let i = arc.startEp; i <= arc.endEp; i++) {
      if (episodes[`${arc.id}:${i}`]) watched++;
    }
    return { watched, total };
  }

  function markAllEpisodes(arc: Arc, value: boolean) {
    setEpisodes((prev) => {
      const next = { ...prev };
      for (let i = arc.startEp; i <= arc.endEp; i++) {
        const key = `${arc.id}:${i}`;
        if (value) {
          next[key] = true;
        } else {
          delete next[key];
        }
      }
      return next;
    });
    setArcs((prev) => ({ ...prev, [arc.id]: value }));
  }

  return {
    arcs,
    episodes,
    toggleArc,
    toggleEpisode,
    isArcComplete,
    isEpisodeWatched,
    getArcEpisodeProgress,
    markAllEpisodes,
  };
}
