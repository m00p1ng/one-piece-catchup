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

  function toggleArc(arc) {
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

  function toggleEpisode(arc, epNum) {
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
