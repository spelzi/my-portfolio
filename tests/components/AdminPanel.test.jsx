import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import { MemoryRouter } from "react-router-dom";
import AdminPanel from "../../src/Component/Admin/AdminPanel";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    isAuthed: vi.fn(),
    getPosts: vi.fn(() => []),
    getProjects: vi.fn(() => []),
    getVideos: vi.fn(() => []),
    logout: vi.fn(),
  },
}));

const renderPanel = () =>
  render(
    <MemoryRouter>
      <AdminPanel />
    </MemoryRouter>,
  );

describe("AdminPanel", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders AdminLogin when not authenticated", () => {
    AdminStore.isAuthed.mockReturnValue(false);
    renderPanel();
    expect(screen.getByText("Admin Panel · Sign in to continue")).toBeInTheDocument();
  });

  it("renders the dashboard by default when authenticated", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeInTheDocument();
    expect(screen.getByText("Welcome back. Here's an overview of your content.")).toBeInTheDocument();
  });

  it("renders all four nav items when authenticated", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    expect(screen.getByRole("button", { name: "Blog Posts" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Past Work" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Videos" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /dashboard/i })).toBeInTheDocument();
  });

  it("switches tabs when a nav item is clicked", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();

    fireEvent.click(screen.getByRole("button", { name: /blog posts/i }));
    expect(screen.getByText("No posts yet")).toBeInTheDocument();
  });

  it("logs out and returns to the login screen", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();

    fireEvent.click(screen.getByText("Sign Out"));
    expect(AdminStore.logout).toHaveBeenCalledOnce();
    expect(screen.getByText("Admin Panel · Sign in to continue")).toBeInTheDocument();
  });

  it("renders a 'View Site' link back to the public site", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();
    expect(screen.getByText("← View Site").closest("a")).toHaveAttribute(
      "href",
      "/",
    );
  });

  // ─── Mobile sidebar ───────────────────────────────────────────────────────
  it("toggles the mobile sidebar via the hamburger button", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();

    const hamburger = screen.getByLabelText("Open menu");
    fireEvent.click(hamburger);
    expect(screen.getByLabelText("Close menu")).toBeInTheDocument();
  });

  it("closes the sidebar when a nav item is clicked on mobile", () => {
    AdminStore.isAuthed.mockReturnValue(true);
    renderPanel();

    fireEvent.click(screen.getByLabelText("Open menu"));
    fireEvent.click(screen.getByRole("button", { name: /blog posts/i }));
    expect(screen.getByLabelText("Open menu")).toBeInTheDocument(); // back to closed state label
  });
});
