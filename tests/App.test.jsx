import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, act } from "./test-utils";
import { MemoryRouter } from "react-router-dom";
import App from "../src/App";

// ─── Mock every page so routing tests are fast and isolated ─────────────────
vi.mock("../src/Component/Home", () => ({
  default: () => <h1>Home Page</h1>,
}));
vi.mock("../src/Component/AboutMe", () => ({
  default: () => <h1>About Me</h1>,
}));
vi.mock("../src/Component/Blog", () => ({
  default: () => <h1>Blog Page</h1>,
}));
vi.mock("../src/Component/BlogPost", () => ({
  default: () => <h1>Blog Post</h1>,
}));
vi.mock("../src/Component/BlogVideo", () => ({
  default: () => <h1>Blog Video</h1>,
}));
vi.mock("../src/Component/PastWork", () => ({
  default: () => <h1>Past Work</h1>,
}));
vi.mock("../src/Component/Admin/AdminPanel", () => ({
  default: () => <h1>Admin Panel</h1>,
}));
vi.mock("../src/Component/MainNav", () => ({
  default: () => <nav>Main Navigation</nav>,
}));
vi.mock("../src/Component/PageLoader", () => ({
  default: () => <div>Loading...</div>,
}));

describe("App Routing", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  // ⚡ Always restore real timers so fake timers don't leak between suites
  afterEach(() => {
    vi.useRealTimers();
  });

  const renderRoute = (route) => {
    render(
      <MemoryRouter initialEntries={[route]}>
        <App />
      </MemoryRouter>,
    );
    // Advance past the page-loader animation (650 ms show + 300 ms fade)
    act(() => {
      vi.runAllTimers();
    });
  };

  it("renders Home page at /", () => {
    renderRoute("/");
    expect(screen.getByText("Home Page")).toBeInTheDocument();
  });

  it("renders About page at /aboutme", () => {
    renderRoute("/aboutme");
    expect(screen.getByText("About Me")).toBeInTheDocument();
  });

  it("renders Blog page at /blog", () => {
    renderRoute("/blog");
    expect(screen.getByText("Blog Page")).toBeInTheDocument();
  });

  it("renders Past Work page at /pastwork", () => {
    renderRoute("/pastwork");
    expect(screen.getByText("Past Work")).toBeInTheDocument();
  });

  it("renders Blog Video page at /blogvideo", () => {
    renderRoute("/blogvideo");
    expect(screen.getByText("Blog Video")).toBeInTheDocument();
  });

  it("renders Admin Panel at /admin (no public nav)", () => {
    renderRoute("/admin");
    expect(screen.getByText("Admin Panel")).toBeInTheDocument();
    // Admin route does NOT include the site nav
    expect(screen.queryByText("Main Navigation")).not.toBeInTheDocument();
  });

  it("shows 404 page for unknown route", () => {
    renderRoute("/does-not-exist");
    expect(screen.getByText(/404 — Page not found/i)).toBeInTheDocument();
  });

  it("renders the site footer on public routes", () => {
    renderRoute("/");
    expect(screen.getByText(/st manuel/i)).toBeInTheDocument();
  });
});
