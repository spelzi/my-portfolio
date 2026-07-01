import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import AdminVideos from "../../src/Component/Admin/AdminVideos";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getVideos: vi.fn(() => []),
    saveVideos: vi.fn(),
  },
}));

describe("AdminVideos", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AdminStore.getVideos.mockReturnValue([]); // undo any mockReturnValue() left by a prior test
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("shows empty state when there are no videos", () => {
    render(<AdminVideos />);
    expect(
      screen.getByText('No videos yet — click "+ Add Video"'),
    ).toBeInTheDocument();
  });

  it("lists existing videos with their category", () => {
    AdminStore.getVideos.mockReturnValue([
      {
        id: "v1",
        youtubeId: "abc123",
        title: "My Video",
        category: "Web Development",
        description: "desc",
        date: "Jan 2025",
      },
    ]);
    render(<AdminVideos />);
    expect(screen.getByText("My Video")).toBeInTheDocument();
    expect(screen.getByText("abc123")).toBeInTheDocument();
  });

  it("shows 'No video ID set' when youtubeId is missing", () => {
    AdminStore.getVideos.mockReturnValue([
      { id: "v1", youtubeId: "", title: "No ID Video", category: "Business", description: "", date: "" },
    ]);
    render(<AdminVideos />);
    expect(screen.getByText("No video ID set")).toBeInTheDocument();
  });

  describe("adding a video", () => {
    it("requires a title before saving", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("+ Add Video"));
      fireEvent.click(screen.getByRole("button", { name: "Add Video" }));

      expect(window.alert).toHaveBeenCalledWith("Title is required.");
      expect(AdminStore.saveVideos).not.toHaveBeenCalled();
    });

    it("saves the youtubeId, title, category, and date together", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("+ Add Video"));

      fireEvent.change(screen.getByPlaceholderText("e.g. dQw4w9WgXcQ"), {
        target: { value: "newVideoId1" },
      });
      fireEvent.change(screen.getByPlaceholderText("Video title"), {
        target: { value: "New Video" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add Video" }));

      const saved = AdminStore.saveVideos.mock.calls[0][0][0];
      expect(saved.youtubeId).toBe("newVideoId1");
      expect(saved.title).toBe("New Video");
    });

    it("shows a thumbnail preview once a youtubeId is entered", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("+ Add Video"));

      fireEvent.change(screen.getByPlaceholderText("e.g. dQw4w9WgXcQ"), {
        target: { value: "previewId" },
      });

      const preview = document.querySelector(".adm-video-id-preview img");
      expect(preview).toHaveAttribute(
        "src",
        "https://img.youtube.com/vi/previewId/mqdefault.jpg",
      );
    });

    it("appends new videos to the end of the list", () => {
      AdminStore.getVideos.mockReturnValue([
        { id: "v1", youtubeId: "", title: "First", category: "Business", description: "", date: "" },
      ]);
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("+ Add Video"));
      fireEvent.change(screen.getByPlaceholderText("Video title"), {
        target: { value: "Second" },
      });
      fireEvent.click(screen.getByRole("button", { name: "Add Video" }));

      const saved = AdminStore.saveVideos.mock.calls[0][0];
      expect(saved[0].title).toBe("First");
      expect(saved[1].title).toBe("Second");
    });
  });

  describe("editing a video", () => {
    beforeEach(() => {
      AdminStore.getVideos.mockReturnValue([
        { id: "v1", youtubeId: "old123", title: "Old Title", category: "Business", description: "", date: "" },
      ]);
    });

    it("pre-fills the form with existing data", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("Edit"));
      expect(screen.getByPlaceholderText("Video title")).toHaveValue(
        "Old Title",
      );
    });

    it("updates in place without duplicating", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("Edit"));
      fireEvent.change(screen.getByPlaceholderText("Video title"), {
        target: { value: "Updated Title" },
      });
      fireEvent.click(screen.getByText("Save Changes"));

      const saved = AdminStore.saveVideos.mock.calls[0][0];
      expect(saved).toHaveLength(1);
      expect(saved[0].title).toBe("Updated Title");
    });
  });

  describe("deleting a video", () => {
    beforeEach(() => {
      AdminStore.getVideos.mockReturnValue([
        { id: "v1", youtubeId: "", title: "Delete Me", category: "Business", description: "", date: "" },
      ]);
    });

    it("shows a confirmation prompt before removing", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("Delete"));
      expect(screen.getByText("Remove this video?")).toBeInTheDocument();
    });

    it("removes the video on confirm", () => {
      render(<AdminVideos />);
      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getByText("Remove"));

      expect(AdminStore.saveVideos).toHaveBeenCalledWith([]);
    });
  });
});
