import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogPost from "../../src/Component/BlogPost";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getPosts: vi.fn((defaults) => defaults),
  },
}));

beforeEach(() => {
  vi.spyOn(window, "scrollTo").mockImplementation(() => {});
});

const renderPost = (slug) =>
  render(
    <MemoryRouter initialEntries={[`/blog/${slug}`]}>
      <Routes>
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blog" element={<div>Blog List</div>} />
      </Routes>
    </MemoryRouter>,
  );

describe("BlogPost", () => {
  describe("valid post", () => {
    const SLUG = "understanding-smart-money-concepts-forex";

    it("renders the post title", () => {
      renderPost(SLUG);
      expect(
        screen.getByText("Understanding Smart Money Concepts in Forex"),
      ).toBeInTheDocument();
    });

    it("renders category and date metadata", () => {
      renderPost(SLUG);
      expect(screen.getByText("Trading")).toBeInTheDocument();
      expect(screen.getByText("Mar 2025")).toBeInTheDocument();
      expect(screen.getByText("· 8 min read")).toBeInTheDocument();
    });

    it("renders author info", () => {
      renderPost(SLUG);
      expect(screen.getByText("St Manuel")).toBeInTheDocument();
      expect(screen.getByText("Uzor Emmanuel Chidiebube")).toBeInTheDocument();
    });

    it("renders the post excerpt", () => {
      renderPost(SLUG);
      expect(
        screen.getByText(/how institutional traders move markets/i),
      ).toBeInTheDocument();
    });

    it("renders paragraph content blocks", () => {
      renderPost(SLUG);
      expect(
        screen.getByText(/Smart Money Concepts \(SMC\) is a framework/i),
      ).toBeInTheDocument();
    });

    it("renders section headings (h2 blocks)", () => {
      renderPost(SLUG);
      expect(screen.getByText("What is 'Smart Money'?")).toBeInTheDocument();
      expect(screen.getByText("Order Blocks")).toBeInTheDocument();
    });

    it("renders blockquote blocks", () => {
      renderPost(SLUG);
      expect(
        screen.getByText(/Stop-loss hunts are not random volatility/i),
      ).toBeInTheDocument();
    });

    it("renders bullet list items", () => {
      renderPost(SLUG);
      expect(
        screen.getByText(/Bullish order block:/i),
      ).toBeInTheDocument();
    });

    it("renders a back link to /blog", () => {
      renderPost(SLUG);
      const backLink = screen.getByText("← Journal");
      expect(backLink.closest("a")).toHaveAttribute("href", "/blog");
    });

    it("scrolls to top on mount", () => {
      renderPost(SLUG);
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("shows Next → navigation for the first post (has next, no prev)", () => {
      renderPost(SLUG); // index 0 — no previous
      expect(screen.getByText("Next →")).toBeInTheDocument();
      expect(screen.queryByText("← Previous")).not.toBeInTheDocument();
    });

    it("shows ← Previous navigation for the last post", () => {
      renderPost("building-crypto-trading-community-telegram"); // last post
      expect(screen.getByText("← Previous")).toBeInTheDocument();
      expect(screen.queryByText("Next →")).not.toBeInTheDocument();
    });

    it("shows both Prev and Next for a middle post", () => {
      renderPost("digital-strategy-entrepreneurs-2025"); // index 2 of 6
      expect(screen.getByText("← Previous")).toBeInTheDocument();
      expect(screen.getByText("Next →")).toBeInTheDocument();
    });

    it("renders an All Posts link", () => {
      renderPost(SLUG);
      expect(screen.getByText("All Posts")).toBeInTheDocument();
    });
  });

  describe("invalid slug", () => {
    it("shows a 404 message for an unknown slug", () => {
      renderPost("this-slug-does-not-exist");
      expect(screen.getByText("Post not found")).toBeInTheDocument();
    });

    it("shows a back link even on the 404 state", () => {
      renderPost("non-existent-post");
      expect(screen.getByText("← Back to Blog")).toBeInTheDocument();
    });
  });
});
