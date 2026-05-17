import { describe, expect, it } from "vitest";
import { findArc, findArcByEp, findSaga, sagas, totalEpisodes } from "./arcs";

describe("arc data helpers", () => {
  it("calculates total episodes from sagas", () => {
    expect(totalEpisodes).toBe(sagas.reduce((sum, saga) => sum + saga.totalEps, 0));
  });

  it("finds arcs and sagas by id or episode", () => {
    expect(findSaga("east-blue")?.name).toBe("East Blue");
    expect(findSaga("missing")).toBeNull();

    expect(findArc("romance-dawn")?.arc.name).toBe("Romance Dawn");
    expect(findArc("missing")).toBeNull();

    expect(findArcByEp(1)?.arc.id).toBe("romance-dawn");
    expect(findArcByEp(-1)).toBeNull();
  });
});
