import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import AdminBlog from "../../src/Component/Admin/AdminBlog";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getPosts: vi.fn(),
    savePosts: vi.fn(),
  },
}));

// Waits for the initial async load (AdminStore.getPosts) to settle, so
// every test starts from a stable, loaded state before interacting.
const waitForLoad = () =>
  waitFor(() => expect(screen.queryByText("Loading…")).not.toBeInTheDocument());

describe("AdminBlog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AdminStore.getPosts.mockResolvedValue([]);
    AdminStore.savePosts.mockResolvedValue(true);
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("shows empty state when there are no posts", async () => {
    render(<AdminBlog />);
    expect(await screen.findByText("No posts yet")).toBeInTheDocument();
  });

  it("lists existing posts in the table", async () => {
    AdminStore.getPosts.mockResolvedValue([
      {
        slug: "test-post",
        title: "Test Post",
        category: "Trading",
        date: "Jan 2025",
        readTime: "5 min read",
        content: [{ type: "p", text: "Hello" }],
      },
    ]);
    render(<AdminBlog />);
    expect(await screen.findByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("/blog/test-post")).toBeInTheDocument();
  });

  // ─── Add flow ─────────────────────────────────────────────────────────────
  describe("adding a post", () => {
    it("opens the add modal when '+ New Post' is clicked", async () => {
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));
      expect(screen.getByText("New Blog Post")).toBeInTheDocument();
    });

    it("requires a title before saving", async () => {
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.click(screen.getByText("Publish Post"));

      expect(window.alert).toHaveBeenCalledWith("Title is required.");
      expect(AdminStore.savePosts).not.toHaveBeenCalled();
    });

    it("auto-generates a slug from the title when slug is left blank", async () => {
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));

      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Great Post!" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      await waitFor(() =>
        expect(AdminStore.savePosts).toHaveBeenCalledWith([
          expect.objectContaining({ slug: "my-great-post", title: "My Great Post!" }),
        ])
      );
    });

    it("prepends the new post to the top of the list", async () => {
      AdminStore.getPosts.mockResolvedValue([
        {
          slug: "old",
          title: "Old Post",
          category: "Trading",
          date: "Jan",
          readTime: "1 min",
          content: [],
        },
      ]);
      render(<AdminBlog />);
      await screen.findByText("Old Post");
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Newest Post" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      await waitFor(() => expect(AdminStore.savePosts).toHaveBeenCalled());
      const calledWith = AdminStore.savePosts.mock.calls[0][0];
      expect(calledWith[0].title).toBe("Newest Post");
      expect(calledWith[1].title).toBe("Old Post");
    });

    it("parses ## headings, > quotes, and - bullets from the body textarea", async () => {
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Parsed Post" },
      });

      const body = "Intro paragraph.\n\n## A Heading\n\n> A quote\n\n- Item one\n- Item two";
      fireEvent.change(screen.getByPlaceholderText(/Opening paragraph here/), {
        target: { value: body },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      await waitFor(() => expect(AdminStore.savePosts).toHaveBeenCalled());
      const saved = AdminStore.savePosts.mock.calls[0][0][0];
      expect(saved.content).toEqual([
        { type: "p", text: "Intro paragraph." },
        { type: "h2", text: "A Heading" },
        { type: "blockquote", text: "A quote" },
        { type: "ul", items: ["Item one", "Item two"] },
      ]);
    });

    it("closes the modal after a successful save", async () => {
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Closes Modal" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      await waitFor(() => expect(screen.queryByText("New Blog Post")).not.toBeInTheDocument());
    });

    it("shows an error and keeps the modal open when the save fails", async () => {
      AdminStore.savePosts.mockRejectedValue(new Error("Network down"));
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Will Fail" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      await waitFor(() =>
        expect(window.alert).toHaveBeenCalledWith("Failed to save: Network down")
      );
      expect(screen.getByText("New Blog Post")).toBeInTheDocument();
    });

    it("can be cancelled without saving", async () => {
      render(<AdminBlog />);
      await waitForLoad();
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.click(screen.getByText("Cancel"));

      expect(screen.queryByText("New Blog Post")).not.toBeInTheDocument();
      expect(AdminStore.savePosts).not.toHaveBeenCalled();
    });
  });

  // ─── Edit flow ────────────────────────────────────────────────────────────
  describe("editing a post", () => {
    const existing = {
      slug: "existing-post",
      title: "Existing Post",
      category: "Web Dev",
      date: "Feb 2025",
      readTime: "5 min read",
      content: [{ type: "p", text: "Original body" }],
    };

    beforeEach(() => {
      AdminStore.getPosts.mockResolvedValue([existing]);
    });

    it("pre-fills the form with the post's existing data", async () => {
      render(<AdminBlog />);
      await screen.findByText("Existing Post");
      fireEvent.click(screen.getByText("Edit"));

      expect(screen.getByPlaceholderText("Post title")).toHaveValue("Existing Post");
    });

    it("saves changes to the existing post (does not duplicate)", async () => {
      render(<AdminBlog />);
      await screen.findByText("Existing Post");
      fireEvent.click(screen.getByText("Edit"));

      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Updated Title" },
      });
      fireEvent.click(screen.getByText("Save Changes"));

      await waitFor(() => expect(AdminStore.savePosts).toHaveBeenCalled());
      const saved = AdminStore.savePosts.mock.calls[0][0];
      expect(saved).toHaveLength(1);
      expect(saved[0].title).toBe("Updated Title");
      expect(saved[0].slug).toBe("existing-post");
    });
  });

  // ─── Delete flow ──────────────────────────────────────────────────────────
  describe("deleting a post", () => {
    beforeEach(() => {
      AdminStore.getPosts.mockResolvedValue([
        {
          slug: "to-delete",
          title: "To Delete",
          category: "Trading",
          date: "Jan",
          readTime: "1 min",
          content: [],
        },
      ]);
    });

    it("shows a confirmation dialog before deleting", async () => {
      render(<AdminBlog />);
      await screen.findByText("To Delete");
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete this post?")).toBeInTheDocument();
    });

    it("removes the post on confirm", async () => {
      render(<AdminBlog />);
      await screen.findByText("To Delete");
      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getAllByText("Delete")[1]); // confirm button in modal

      await waitFor(() => expect(AdminStore.savePosts).toHaveBeenCalledWith([]));
    });

    it("does not delete when cancelled", async () => {
      render(<AdminBlog />);
      await screen.findByText("To Delete");
      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getByText("Cancel"));

      expect(AdminStore.savePosts).not.toHaveBeenCalled();
      expect(screen.queryByText("Delete this post?")).not.toBeInTheDocument();
    });
  });

  // ─── Count callback ───────────────────────────────────────────────────────
  it("calls onCountChange with the updated count after saving", async () => {
    const onCountChange = vi.fn();
    render(<AdminBlog onCountChange={onCountChange} />);
    await waitForLoad();
    fireEvent.click(screen.getByText("+ New Post"));
    fireEvent.change(screen.getByPlaceholderText("Post title"), {
      target: { value: "Counted Post" },
    });
    fireEvent.click(screen.getByText("Publish Post"));

    await waitFor(() => expect(onCountChange).toHaveBeenCalledWith(1));
  });

  it("calls onCountChange with the initial count after the first load", async () => {
    AdminStore.getPosts.mockResolvedValue([
      { slug: "a", title: "A", category: "Trading", date: "Jan", readTime: "1 min", content: [] },
      { slug: "b", title: "B", category: "Trading", date: "Jan", readTime: "1 min", content: [] },
    ]);
    const onCountChange = vi.fn();
    render(<AdminBlog onCountChange={onCountChange} />);
    await waitFor(() => expect(onCountChange).toHaveBeenCalledWith(2));
  });
});
