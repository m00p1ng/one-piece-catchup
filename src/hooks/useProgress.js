import { useState, useEffect } from "react";

const ARC_KEY = "one-piece-arcs";
const EP_KEY = "one-piece-episodes";

function load(key) {
  try {
    // Migrate from old key name
    if (key === ARC_KEY) {
      const legacy = localStorage.getItem("one-piece-progress");
      if (legacy && !localStorage.getItem(ARC_KEY)) {
        localStorage.setItem(ARC_KEY, legacy);
      }
    }
    return JSON.parse(localStorage.getItem(key) || "{}");
  } catch {
    return {};
  }
}

export function useProgress() {
  const [arcs, setArcs] = useState(() => load(ARC_KEY));
  const [episodes, setEpisodes] = useState(() => load(EP_KEY));

  useEffect(() => {
    localStorage.setItem(ARC_KEY, JSON.stringify(arcs));
  }, [arcs]);

  useEffect(() => {
    localStorage.setItem(EP_KEY, JSON.stringify(episodes));
  }, [episodes]);

  function toggleArc(arcId) {
    setArcs((prev) => ({ ...prev, [arcId]: !prev[arcId] }));
  }

  function toggleEpisode(arcId, epNum) {
    setEpisodes((prev) => {
      const key = `${arcId}:${epNum}`;
      return { ...prev, [key]: !prev[key] };
    });
  }

  function isArcComplete(arcId) {
    return !!arcs[arcId];
  }

  function isEpisodeWatched(arcId, epNum) {
    return !!episodes[`${arcId}:${epNum}`];
  }

  function getArcEpisodeProgress(arc) {
    if (!arc.startEp || !arc.endEp) return { watched: 0, total: 0 };
    const total = arc.endEp - arc.startEp + 1;
    let watched = 0;
    for (let i = arc.startEp; i <= arc.endEp; i++) {
      if (episodes[`${arc.id}:${i}`]) watched++;
    }
    return { watched, total };
  }

  function markAllEpisodes(arc, value) {
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
