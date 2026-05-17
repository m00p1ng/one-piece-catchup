import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { page, userEvent } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";

let root: Root | null = null;
let container: HTMLDivElement | null = null;

function renderApp(path = "/") {
  window.history.replaceState({}, "", path);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  root.render(<App basename="/" />);
}

async function waitForEpisodeRow(ep: number) {
  await vi.waitFor(() => {
    const row = document.getElementById(`ep-${ep}`);

    expect(row?.parentElement?.getBoundingClientRect().height).toBeGreaterThan(0);
  });
}

describe("app browser flows", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    root?.unmount();
    root = null;
    container?.remove();
    container = null;
    window.history.replaceState({}, "", "/");
  });

  it("renders the home page and opens an arc detail", async () => {
    renderApp();

    expect(getComputedStyle(document.body).backgroundColor).toBe("rgb(5, 13, 26)");
    await expect.element(page.getByRole("heading", { name: "One Piece" })).toBeInTheDocument();
    expect(getComputedStyle(document.querySelector(".min-h-screen")!).minHeight).toBe(`${window.innerHeight}px`);
    await expect.element(page.getByRole("link", { name: "East Blue" })).toBeInTheDocument();

    await page.getByRole("link", { name: /3 ep Romance Dawn/ }).click();

    await expect.element(page.getByRole("heading", { name: "Romance Dawn" })).toBeInTheDocument();
    await expect.element(page.getByText("Tap an episode to mark it as your current watching point")).toBeInTheDocument();
  });

  it("marks an episode as current and persists progress", async () => {
    renderApp("/arc/romance-dawn");

    await waitForEpisodeRow(2);
    await userEvent.type(page.getByRole("button", { name: "Mark episode 2 as current" }), "{Enter}");

    await expect.element(page.getByText("NOW")).toBeInTheDocument();
    expect(localStorage.getItem("one-piece-current-ep")).toBe("2");
  });

  it("filters an arc to key episodes", async () => {
    renderApp("/arc/romance-dawn");

    await expect.element(page.getByText(/The Great Swordsman Appears/)).toBeInTheDocument();
    await page.getByRole("button", { name: "Key only" }).click();

    await expect.element(page.getByText(/The Great Swordsman Appears/)).not.toBeInTheDocument();
    await expect.element(page.getByText("Series premier")).toBeInTheDocument();
  });

  it("renders a completed saga detail and hides watched arcs", async () => {
    localStorage.setItem("one-piece-current-ep", "61");

    renderApp("/saga/east-blue");

    await expect.element(page.getByRole("heading", { name: "East Blue" })).toBeInTheDocument();
    await expect.element(page.getByText("8/8 completed")).toBeInTheDocument();
    await expect.element(page.getByText("✓ Complete")).toBeInTheDocument();

    await page.getByRole("button", { name: "Hide" }).click();

    await expect.element(page.getByText("All arcs watched")).toBeInTheDocument();
  });

  it("renders saga and arc not-found states", async () => {
    renderApp("/saga/missing");

    await expect.element(page.getByText("Saga not found")).toBeInTheDocument();
    await expect.element(page.getByRole("link", { name: "Back to home" })).toBeInTheDocument();

    root?.unmount();
    root = null;
    container?.remove();
    container = null;

    renderApp("/arc/missing");

    await expect.element(page.getByText("Arc not found")).toBeInTheDocument();
    await expect.element(page.getByRole("link", { name: "Back to home" })).toBeInTheDocument();
  });

  it("renders current and next episode previews on home", async () => {
    localStorage.setItem("one-piece-current-ep", "2");

    renderApp("/");

    await expect.element(page.getByRole("button", { name: /Now/ })).toBeInTheDocument();
    await expect.element(page.getByRole("button", { name: /Next/ })).toBeInTheDocument();

    await page.getByRole("button", { name: /Now/ }).click();
    await expect.element(page.getByRole("heading", { name: "Romance Dawn" })).toBeInTheDocument();
  });

  it("opens the next episode preview on home", async () => {
    localStorage.setItem("one-piece-current-ep", "2");

    renderApp("/");

    await page.getByRole("button", { name: /Next/ }).click();

    await expect.element(page.getByRole("heading", { name: "Romance Dawn" })).toBeInTheDocument();
  });

  it("toggles saga sections and home watched filtering", async () => {
    localStorage.setItem("one-piece-current-ep", "61");

    renderApp("/");

    await expect.element(page.getByRole("link", { name: "East Blue" })).toBeInTheDocument();

    await page.getByRole("button", { name: /East Blue/ }).click();
    await expect.element(page.getByRole("link", { name: "🏴‍☠️ 3 ep Romance Dawn Ep 1–3★" })).toBeInTheDocument();

    await page.getByRole("link", { name: "East Blue" }).click();
    await expect.element(page.getByRole("heading", { name: "East Blue" })).toBeInTheDocument();
  });

  it("collapses saga sections and filters watched sagas", async () => {
    localStorage.setItem("one-piece-current-ep", "61");

    renderApp("/");

    await page.getByRole("button", { name: /East Blue/ }).click();
    await expect.element(page.getByRole("link", { name: "🏴‍☠️ 3 ep Romance Dawn Ep 1–3★" })).toBeInTheDocument();

    await page.getByRole("button", { name: /East Blue/ }).click();
    await expect.element(page.getByRole("link", { name: "🏴‍☠️ 3 ep Romance Dawn Ep 1–3★" })).not.toBeInTheDocument();

    await page.getByRole("button", { name: "Hide" }).click();
    await expect.element(page.getByRole("link", { name: "East Blue" })).not.toBeInTheDocument();
  });

  it("shows undo when jumping progress between arcs", async () => {
    localStorage.setItem("one-piece-current-ep", "2");

    renderApp("/arc/orange-town");

    await waitForEpisodeRow(8);
    await userEvent.type(page.getByRole("button", { name: "Mark episode 8 as current" }), "{Enter}");

    await expect.element(page.getByText("Undo")).toBeInTheDocument();
    await expect.element(page.getByText("Moved to")).toBeInTheDocument();

    await page.getByRole("button", { name: "Undo" }).click();

    await expect.element(page.getByText("Undo")).not.toBeInTheDocument();
    expect(localStorage.getItem("one-piece-current-ep")).toBe("2");
  });

  it("shows arc meta, completion state, and empty episode filters", async () => {
    localStorage.setItem("one-piece-current-ep", "4");

    renderApp("/arc/romance-dawn");

    await expect.element(page.getByText("Alvida / Captain Morgan")).toBeInTheDocument();
    await expect.element(page.getByText("Must Watch")).toBeInTheDocument();
    await expect.element(page.getByText("Shanks saves Luffy & gives him his straw hat")).toBeInTheDocument();
    await expect.element(page.getByText("Romance Dawn Complete!")).toBeInTheDocument();

    await page.getByRole("button", { name: "Hide" }).click();

    await expect.element(page.getByText("All episodes watched")).toBeInTheDocument();
  });
});
