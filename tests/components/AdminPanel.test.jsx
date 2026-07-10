import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import { MemoryRouter } from "react-router-dom";
import AdminPanel from "../../src/Component/Admin/AdminPanel";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    isAuthed: vi.fn(),
    getPosts: vi.fn(),
    getProjects: vi.fn(),
    getVideos: vi.fn(),
    logout: vi.fn(),
  },
}));

const renderPanel = () =>
  render(
    <MemoryRouter>
      <AdminPanel />
    </MemoryRouter>
  );

// AdminPanel fetches post/project/video counts as soon as `authed` is true
// (see refreshCounts in AdminPanel.jsx). Every test that authenticates
// needs to let that settle before finishing, or React warns about a state
// update happening after the test has already torn down.
const flushCounts = () =>
  waitFor(() => {
    expect(AdminStore.getPosts).toHaveBeenCalled();
    expect(AdminStore.getProjects).toHaveBeenCalled();
    expect(AdminStore.getVideos).toHaveBeenCalled();
  });

describe("AdminPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // AdminPanel's own count-fetching AND every child tab (AdminBlog,
    // AdminPastWork, AdminVideos) call these same mocked functions — all
    // need to resolve as promises, matching the real async AdminStore API.
    AdminStore.getPosts.mockResolvedValue([]);
    AdminStore.getProjects.mockResolvedValue([]);
    AdminStore.getVideos.mockResolvedValue([]);
  });

  it("renders AdminLogin when not authenticated", () => {
    AdminStore.isAuthed.mockReturnValue(false);
    renderPanel();
    expect(screen.getByText("Admin Panel · Sign in to continue")).toBeInTheDocument();
  });

  it("renders the dashboard by default when authenticated", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(
      screen.getByText("Welcome back. Here's an overview of your content.")
    ).toBeInTheDocument();
    await flushCounts();
  });

  it("renders all four nav items when authenticated", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    expect(screen.getByRole("button", { name: "Blog Posts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Past Work" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Videos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
    await flushCounts();
  });

  it("switches tabs when a nav item is clicked", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();

    fireEvent.click(screen.getByRole("button", { name: /blog posts/i }));
    // AdminBlog mounts and fetches its own data async — wait for its
    // loading state to clear before asserting on its content.
    expect(await screen.findByText("No posts yet")).toBeInTheDocument();
  });

  it("logs out and returns to the login screen", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    await flushCounts();

    fireEvent.click(screen.getByText("Sign Out"));
    expect(AdminStore.logout).toHaveBeenCalledOnce();
    expect(screen.getByText("Admin Panel · Sign in to continue")).toBeInTheDocument();
  });

  it("renders a 'View Site' link back to the public site", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    expect(screen.getByText("← View Site").closest("a")).toHaveAttribute("href", "/");
    await flushCounts();
  });

  // ─── Dashboard counts ─────────────────────────────────────────────────────
  it("fetches live counts for posts, projects, and videos on load", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    AdminStore.getPosts.mockResolvedValue([{ slug: "a" }, { slug: "b" }]);
    AdminStore.getProjects.mockResolvedValue([{ id: "p1" }]);
    AdminStore.getVideos.mockResolvedValue([]);
    renderPanel();
    await flushCounts();
  });

  // ─── Mobile sidebar ───────────────────────────────────────────────────────
  it("toggles the mobile sidebar via the hamburger button", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    await flushCounts();

    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("closes the sidebar when a nav item is clicked on mobile", async () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();

    fireEvent.click(screen.getByLabelText("Open menu"));
    fireEvent.click(screen.getByRole("button", { name: /blog posts/i }));
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument(); // back to closed state label
    // Let AdminBlog's async load settle before the test ends, so it
    // doesn't warn about a state update after the test has finished.
    await screen.findByText("No posts yet");
  });
});
