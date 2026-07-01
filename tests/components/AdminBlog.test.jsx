import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import AdminBlog from "../../src/Component/Admin/AdminBlog";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getPosts: vi.fn(() => []),
    savePosts: vi.fn(),
  },
}));

describe("AdminBlog", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AdminStore.getPosts.mockReturnValue([]); // undo any mockReturnValue() left by a prior test
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("shows empty state when there are no posts", () => {
    render(<AdminBlog />);
    expect(screen.getByText("No posts yet")).toBeInTheDocument();
  });

  it("lists existing posts in the table", () => {
    AdminStore.getPosts.mockReturnValue([
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
    expect(screen.getByText("Test Post")).toBeInTheDocument();
    expect(screen.getByText("/blog/test-post")).toBeInTheDocument();
  });

  // ─── Add flow ─────────────────────────────────────────────────────────────
  describe("adding a post", () => {
    it("opens the add modal when '+ New Post' is clicked", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("+ New Post"));
      expect(screen.getByText("New Blog Post")).toBeInTheDocument();
    });

    it("requires a title before saving", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.click(screen.getByText("Publish Post"));

      expect(window.alert).toHaveBeenCalledWith("Title is required.");
      expect(AdminStore.savePosts).not.toHaveBeenCalled();
    });

    it("auto-generates a slug from the title when slug is left blank", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("+ New Post"));

      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "My Great Post!" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      expect(AdminStore.savePosts).toHaveBeenCalledWith([
        expect.objectContaining({ slug: "my-great-post", title: "My Great Post!" }),
      ]);
    });

    it("prepends the new post to the top of the list", () => {
      AdminStore.getPosts.mockReturnValue([
        { slug: "old", title: "Old Post", category: "Trading", date: "Jan", readTime: "1 min", content: [] },
      ]);
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Newest Post" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      const calledWith = AdminStore.savePosts.mock.calls[0][0];
      expect(calledWith[0].title).toBe("Newest Post");
      expect(calledWith[1].title).toBe("Old Post");
    });

    it("parses ## headings, > quotes, and - bullets from the body textarea", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Parsed Post" },
      });

      const body = "Intro paragraph.\n\n## A Heading\n\n> A quote\n\n- Item one\n- Item two";
      fireEvent.change(
        screen.getByPlaceholderText(/Opening paragraph here/),
        { target: { value: body } },
      );
      fireEvent.click(screen.getByText("Publish Post"));

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
      fireEvent.click(screen.getByText("+ New Post"));
      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Closes Modal" },
      });
      fireEvent.click(screen.getByText("Publish Post"));

      await waitFor(() =>
        expect(screen.queryByText("New Blog Post")).not.toBeInTheDocument(),
      );
    });

    it("can be cancelled without saving", () => {
      render(<AdminBlog />);
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
      AdminStore.getPosts.mockReturnValue([existing]);
    });

    it("pre-fills the form with the post's existing data", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("Edit"));

      expect(screen.getByPlaceholderText("Post title")).toHaveValue(
        "Existing Post",
      );
    });

    it("saves changes to the existing post (does not duplicate)", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("Edit"));

      fireEvent.change(screen.getByPlaceholderText("Post title"), {
        target: { value: "Updated Title" },
      });
      fireEvent.click(screen.getByText("Save Changes"));

      const saved = AdminStore.savePosts.mock.calls[0][0];
      expect(saved).toHaveLength(1);
      expect(saved[0].title).toBe("Updated Title");
      expect(saved[0].slug).toBe("existing-post");
    });
  });

  // ─── Delete flow ──────────────────────────────────────────────────────────
  describe("deleting a post", () => {
    beforeEach(() => {
      AdminStore.getPosts.mockReturnValue([
        { slug: "to-delete", title: "To Delete", category: "Trading", date: "Jan", readTime: "1 min", content: [] },
      ]);
    });

    it("shows a confirmation dialog before deleting", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Delete this post?")).toBeInTheDocument();
    });

    it("removes the post on confirm", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getAllByText("Delete")[1]); // confirm button in modal

      expect(AdminStore.savePosts).toHaveBeenCalledWith([]);
    });

    it("does not delete when cancelled", () => {
      render(<AdminBlog />);
      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getByText("Cancel"));

      expect(AdminStore.savePosts).not.toHaveBeenCalled();
      expect(screen.queryByText("Delete this post?")).not.toBeInTheDocument();
    });
  });

  // ─── Count callback ───────────────────────────────────────────────────────
  it("calls onCountChange with the updated count after saving", () => {
    const onCountChange = vi.fn();
    render(<AdminBlog onCountChange={onCountChange} />);
    fireEvent.click(screen.getByText("+ New Post"));
    fireEvent.change(screen.getByPlaceholderText("Post title"), {
      target: { value: "Counted Post" },
    });
    fireEvent.click(screen.getByText("Publish Post"));

    expect(onCountChange).toHaveBeenCalledWith(1);
  });
});
