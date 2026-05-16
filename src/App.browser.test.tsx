import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { page } from "vitest/browser";
import { createRoot, type Root } from "react-dom/client";
import App from "./App";
import "./index.css";

let root: Root | null = null;
let container: HTMLDivElement | null = null;

function renderApp(path = "/") {
  window.history.replaceState({}, "", path);
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  root.render(<App basename="/" />);
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

    await expect.element(page.getByRole("heading", { name: "One Piece" })).toBeInTheDocument();
    await expect.element(page.getByRole("link", { name: "East Blue" })).toBeInTheDocument();

    await page.getByRole("link", { name: /3 ep Romance Dawn/ }).click();

    await expect.element(page.getByRole("heading", { name: "Romance Dawn" })).toBeInTheDocument();
    await expect.element(page.getByText("Tap an episode to mark it as your current watching point")).toBeInTheDocument();
  });

  it("marks an episode as current and persists progress", async () => {
    renderApp("/arc/romance-dawn");

    await page.getByRole("button", { name: "Mark episode 2 as current" }).click();

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
});
