import { describe, expect, it } from "vitest";
import type { Arc } from "../types";
import {
  getArcEpisodeProgress,
  getStoredEpisode,
  isArcComplete,
  isArcInProgress,
  isEpisodeWatched,
} from "./progress";

const arc: Arc = {
  id: "test-arc",
  name: "Test Arc",
  episodes: "10-14",
  startEp: 10,
  endEp: 14,
  count: 5,
  thumbnailEmoji: "",
  description: "",
  villain: "",
  rating: 0,
};

describe("progress helpers", () => {
  it("parses stored episode values safely", () => {
    expect(getStoredEpisode(null)).toBe(0);
    expect(getStoredEpisode("42")).toBe(42);
    expect(getStoredEpisode("42abc")).toBe(42);
    expect(getStoredEpisode("abc")).toBe(0);
    expect(getStoredEpisode("-1")).toBe(0);
  });

  it("treats episodes before the current episode as watched", () => {
    expect(isEpisodeWatched(12, 11)).toBe(true);
    expect(isEpisodeWatched(12, 12)).toBe(false);
    expect(isEpisodeWatched(12, 13)).toBe(false);
  });

  it("identifies complete and in-progress arcs at boundaries", () => {
    expect(isArcComplete(9, arc)).toBe(false);
    expect(isArcInProgress(9, arc)).toBe(false);

    expect(isArcComplete(10, arc)).toBe(false);
    expect(isArcInProgress(10, arc)).toBe(true);

    expect(isArcComplete(14, arc)).toBe(true);
    expect(isArcInProgress(14, arc)).toBe(false);
  });

  it("clamps arc episode progress to the arc range", () => {
    expect(getArcEpisodeProgress(9, arc)).toEqual({ watched: 0, total: 5 });
    expect(getArcEpisodeProgress(10, arc)).toEqual({ watched: 1, total: 5 });
    expect(getArcEpisodeProgress(12, arc)).toEqual({ watched: 3, total: 5 });
    expect(getArcEpisodeProgress(99, arc)).toEqual({ watched: 5, total: 5 });
  });
});
