import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { useStoredState } from "../hooks/useStoredState";
import { sagas } from "../data/arcs";
import CompletionCelebration from "./CompletionCelebration";
import EpisodeList from "./EpisodeList";
import Hero from "./Hero";
import StickySagaIndicator from "./StickySagaIndicator";
import WaveBackground from "./WaveBackground";

let root: Root | null = null;
let container: HTMLDivElement | null = null;

function renderNode(node: ReactNode) {
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  root.render(<BrowserRouter>{node}</BrowserRouter>);
}

async function waitForEpisodeRow(ep: number) {
  await vi.waitFor(() => {
    const row = document.getElementById(`ep-${ep}`);

    expect(row?.parentElement?.getBoundingClientRect().height).toBeGreaterThan(0);
  });
}

describe("component branch coverage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    root?.unmount();
    root = null;
    container?.remove();
    container = null;
    vi.restoreAllMocks();
  });

  it("runs the hero scroll animation handler", async () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => undefined);
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(performance.now() + 1300);
      return 1;
    });

    renderNode(<Hero totalArcs={10} completedArcs={4} currentEpisode={0} totalEps={1161} />);

    await expect.element(page.getByRole("heading", { name: "One Piece" })).toBeInTheDocument();
    await expect.element(page.getByText("—")).toBeInTheDocument();
    const scrollControl = container?.querySelector(".cursor-pointer") as HTMLElement | null;
    scrollControl?.click();

    expect(scrollTo).toHaveBeenCalled();
  });

  it("renders hidden and visible celebration states", async () => {
    renderNode(
      <>
        <CompletionCelebration show={false} />
        <CompletionCelebration show />
      </>
    );

    await expect.element(page.getByText("You Found It!")).toBeInTheDocument();
  });

  it("handles sticky saga null and populated states", async () => {
    const saga = sagas[0];

    renderNode(
      <>
        <StickySagaIndicator saga={null} completedArcs={0} />
        <StickySagaIndicator saga={saga} completedArcs={2} />
      </>
    );

    await expect.element(page.getByText("2/8 arcs")).toBeInTheDocument();
  });

  it("covers episode click and landmark title interactions", async () => {
    const arc = sagas[0].arcs[0];
    const onSetCurrentEpisode = vi.fn();

    renderNode(
      <EpisodeList
        arc={arc}
        sagaColor={sagas[0].color}
        currentEpisode={1}
        watched={1}
        total={3}
        isEpisodeWatched={(ep) => ep < 1}
        hideWatched={false}
        onHideWatchedChange={vi.fn()}
        onSetCurrentEpisode={onSetCurrentEpisode}
      />
    );

    await waitForEpisodeRow(2);
    await userEvent.type(page.getByRole("button", { name: "Mark episode 2 as current" }), "{Enter}");
    expect(onSetCurrentEpisode).toHaveBeenCalledWith(2);

    await page.getByText(/The Great Swordsman Appears/).click();
  });

  it("handles storage parser and write failures", async () => {
    function StoredStateProbe() {
      const [value, setValue] = useStoredState<string>("probe", "fallback", {
        parse: () => {
          throw new Error("parse failed");
        },
        serialize: () => {
          throw new Error("serialize failed");
        },
      });

      return (
        <button type="button" onClick={() => setValue((previous) => `${previous}!`)}>
          {value}
        </button>
      );
    }

    renderNode(<StoredStateProbe />);

    await expect.element(page.getByRole("button", { name: "fallback" })).toBeInTheDocument();
    await page.getByRole("button", { name: "fallback" }).click();
    await expect.element(page.getByRole("button", { name: "fallback!" })).toBeInTheDocument();
  });

  it("uses the default stored-state parser and setter", async () => {
    localStorage.setItem("plain-probe", "saved");

    function DefaultStoredStateProbe() {
      const [value, setValue] = useStoredState<string>("plain-probe", "fallback");

      return (
        <button type="button" onClick={() => setValue("changed")}>
          {value}
        </button>
      );
    }

    renderNode(<DefaultStoredStateProbe />);

    await expect.element(page.getByRole("button", { name: "saved" })).toBeInTheDocument();
    await page.getByRole("button", { name: "saved" }).click();
    await expect.element(page.getByRole("button", { name: "changed" })).toBeInTheDocument();
  });

  it("renders all wave layers", async () => {
    renderNode(<WaveBackground />);
    await new Promise((resolve) => requestAnimationFrame(resolve));

    expect(container?.querySelectorAll('[class*="absolute"]').length).toBeGreaterThan(10);
  });
});
