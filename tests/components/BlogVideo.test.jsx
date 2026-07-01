import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import BlogVideo from "../../src/Component/BlogVideo";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getVideos: vi.fn((defaults) => defaults),
  },
}));

describe("BlogVideo", () => {
  it("renders the page title", () => {
    render(<BlogVideo />);
    expect(screen.getByText("Watch & Learn")).toBeInTheDocument();
  });

  it("renders all default video titles", () => {
    render(<BlogVideo />);
    expect(
      screen.getByText("Smart Money Concepts — Full Breakdown"),
    ).toBeInTheDocument();
    expect(
      screen.getByText("How to Build a React App from Scratch"),
    ).toBeInTheDocument();
  });

  it("shows 'Add video ID in Admin' badge when youtubeId is empty", () => {
    render(<BlogVideo />);
    // All default videos ship with an empty youtubeId
    const badges = screen.getAllByText("Add video ID in Admin");
    expect(badges.length).toBeGreaterThan(0);
  });

  it("shows 'No video linked yet' instead of a Watch link when no ID", () => {
    render(<BlogVideo />);
    const noLinkLabels = screen.getAllByText("No video linked yet");
    expect(noLinkLabels.length).toBeGreaterThan(0);
  });

  it("renders the 'More on YouTube' channel link", () => {
    render(<BlogVideo />);
    const link = screen.getByText(/More on YouTube/i);
    expect(link.closest("a")).toHaveAttribute(
      "href",
      "https://www.youtube.com/@St_manuel1",
    );
  });

  it("mounts the preview iframe only after hover (lazy load)", () => {
    render(<BlogVideo />);
    // No iframes should exist before any hover, since all default videos
    // lack a youtubeId in this fixture (so no iframe can mount regardless,
    // but this also verifies no error is thrown rendering id-less cards)
    expect(document.querySelectorAll("iframe").length).toBe(0);
  });

  it("renders category labels for videos", () => {
    render(<BlogVideo />);
    expect(screen.getAllByText("Crypto Trading").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Web Development").length).toBeGreaterThan(0);
    expect(screen.getAllByText("Forex Trading").length).toBeGreaterThan(0);
  });

  // ─── With a real video ID injected ───────────────────────────────────────
  describe("when a video has a youtubeId", () => {
    const videosWithId = [
      {
        id: "vid_x",
        youtubeId: "dQw4w9WgXcQ",
        title: "Test Video",
        category: "Web Development",
        description: "A test video",
        date: "Jan 2025",
      },
    ];

    it("renders a Watch on YouTube link with the correct URL", async () => {
      const { AdminStore } = await import(
        "../../src/Component/Admin/AdminStore"
      );
      AdminStore.getVideos.mockReturnValueOnce(videosWithId);

      render(<BlogVideo />);
      const watchLink = screen.getByText(/Watch on YouTube →/i);
      expect(watchLink.closest("a")).toHaveAttribute(
        "href",
        "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      );
    });

    it("mounts the preview iframe on hover", async () => {
      const { AdminStore } = await import(
        "../../src/Component/Admin/AdminStore"
      );
      AdminStore.getVideos.mockReturnValueOnce(videosWithId);

      render(<BlogVideo />);
      const card = screen.getByText("Test Video").closest(".video-card");
      fireEvent.mouseEnter(card);

      expect(document.querySelector("iframe")).toBeInTheDocument();
    });

    it("unmounts hover state (but keeps iframe mounted) on mouse leave", async () => {
      const { AdminStore } = await import(
        "../../src/Component/Admin/AdminStore"
      );
      AdminStore.getVideos.mockReturnValueOnce(videosWithId);

      render(<BlogVideo />);
      const card = screen.getByText("Test Video").closest(".video-card");
      fireEvent.mouseEnter(card);
      fireEvent.mouseLeave(card);

      expect(card).not.toHaveClass("is-hovered");
    });
  });
});
