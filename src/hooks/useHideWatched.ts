import { useStoredState } from "./useStoredState";

const HIDE_WATCHED_KEY = "hideWatched";

export function useHideWatched() {
  return useStoredState(HIDE_WATCHED_KEY, false, {
    parse: (rawValue) => rawValue === "true",
  });
}
