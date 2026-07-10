import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "../test-utils";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import BlogPost from "../../src/Component/BlogPost";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getPosts: vi.fn((defaults) => Promise.resolve(defaults)),
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
    </MemoryRouter>
  );

describe("BlogPost", () => {
  describe("valid post", () => {
    const SLUG = "understanding-smart-money-concepts-forex";

    // Every test here uses `await screen.findByText(...)` for its first
    // assertion. The post is actually already present from the very first
    // render (it's in the local `defaultPosts` fallback), but findByText
    // also waits for the mocked getPosts() promise to resolve — without
    // that, React warns about a state update happening after the test has
    // already finished asserting and torn down.

    it("renders the post title", async () => {
      renderPost(SLUG);
      expect(
        await screen.findByText("Understanding Smart Money Concepts in Forex")
      ).toBeInTheDocument();
    });

    it("renders category and date metadata", async () => {
      renderPost(SLUG);
      expect(await screen.findByText("Trading")).toBeInTheDocument();
      expect(screen.getByText("Mar 2025")).toBeInTheDocument();
      expect(screen.getByText("· 8 min read")).toBeInTheDocument();
    });

    it("renders author info", async () => {
      renderPost(SLUG);
      expect(await screen.findByText("St Manuel")).toBeInTheDocument();
      expect(screen.getByText("Uzor Emmanuel Chidiebube")).toBeInTheDocument();
    });

    it("renders the post excerpt", async () => {
      renderPost(SLUG);
      expect(
        await screen.findByText(/how institutional traders move markets/i)
      ).toBeInTheDocument();
    });

    it("renders paragraph content blocks", async () => {
      renderPost(SLUG);
      expect(
        await screen.findByText(/Smart Money Concepts \(SMC\) is a framework/i)
      ).toBeInTheDocument();
    });

    it("renders section headings (h2 blocks)", async () => {
      renderPost(SLUG);
      expect(await screen.findByText("What is 'Smart Money'?")).toBeInTheDocument();
      expect(screen.getByText("Order Blocks")).toBeInTheDocument();
    });

    it("renders blockquote blocks", async () => {
      renderPost(SLUG);
      expect(
        await screen.findByText(/Stop-loss hunts are not random volatility/i)
      ).toBeInTheDocument();
    });

    it("renders bullet list items", async () => {
      renderPost(SLUG);
      expect(await screen.findByText(/Bullish order block:/i)).toBeInTheDocument();
    });

    it("renders a back link to /blog", async () => {
      renderPost(SLUG);
      const backLink = await screen.findByText("← Journal");
      expect(backLink.closest("a")).toHaveAttribute("href", "/blog");
    });

    it("scrolls to top on mount", async () => {
      renderPost(SLUG);
      await screen.findByText("← Journal"); // let the async load settle
      expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
    });

    it("shows Next → navigation for the first post (has next, no prev)", async () => {
      renderPost(SLUG); // index 0 — no previous
      expect(await screen.findByText("Next →")).toBeInTheDocument();
      expect(screen.queryByText("← Previous")).not.toBeInTheDocument();
    });

    it("shows ← Previous navigation for the last post", async () => {
      renderPost("building-crypto-trading-community-telegram"); // last post
      expect(await screen.findByText("← Previous")).toBeInTheDocument();
      expect(screen.queryByText("Next →")).not.toBeInTheDocument();
    });

    it("shows both Prev and Next for a middle post", async () => {
      renderPost("digital-strategy-entrepreneurs-2025"); // index 2 of 6
      expect(await screen.findByText("← Previous")).toBeInTheDocument();
      expect(screen.getByText("Next →")).toBeInTheDocument();
    });

    it("renders an All Posts link", async () => {
      renderPost(SLUG);
      expect(await screen.findByText("All Posts")).toBeInTheDocument();
    });
  });

  describe("invalid slug", () => {
    it("does not show 'not found' before the live fetch resolves", () => {
      // A promise that never resolves during this test — simulates the
      // window between mount and the fetch completing.
      AdminStore.getPosts.mockReturnValueOnce(new Promise(() => {}));

      renderPost("a-brand-new-post-not-in-defaults");
      expect(screen.queryByText("Post not found")).not.toBeInTheDocument();
    });

    it("shows a 404 message for an unknown slug", async () => {
      renderPost("this-slug-does-not-exist");
      // The component intentionally renders nothing on the very first
      // paint for an unrecognized slug — it only shows "not found" once
      // the live fetch has confirmed the post truly doesn't exist. This
      // prevents a false-negative flash for a post published after the
      // last deploy (not in local defaults, but real in the live data).
      expect(await screen.findByText("Post not found")).toBeInTheDocument();
    });

    it("shows a back link even on the 404 state", async () => {
      renderPost("non-existent-post");
      expect(await screen.findByText("← Back to Blog")).toBeInTheDocument();
    });
  });
});
