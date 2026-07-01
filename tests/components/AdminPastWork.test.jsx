import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import AdminPastWork from "../../src/Component/Admin/AdminPastWork";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getProjects: vi.fn(() => []),
    saveProjects: vi.fn(),
  },
}));

describe("AdminPastWork", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    AdminStore.getProjects.mockReturnValue([]); // undo any mockReturnValue() left by a prior test
    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  it("shows empty state when there are no projects", () => {
    render(<AdminPastWork />);
    expect(screen.getByText("No projects yet")).toBeInTheDocument();
  });

  it("lists existing projects", () => {
    AdminStore.getProjects.mockReturnValue([
      {
        id: "p1",
        title: "Test Project",
        category: "Frontend",
        stack: ["React", "Vite"],
        desc: "A test project",
        status: "Live",
        link: "",
        link1: "",
      },
    ]);
    render(<AdminPastWork />);
    expect(screen.getByText("Test Project")).toBeInTheDocument();
    expect(screen.getByText("React, Vite")).toBeInTheDocument();
  });

  describe("adding a project", () => {
    it("requires a title before saving", () => {
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("+ Add Project"));
      fireEvent.click(screen.getByText("Add Project"));

      expect(window.alert).toHaveBeenCalledWith("Title is required.");
      expect(AdminStore.saveProjects).not.toHaveBeenCalled();
    });

    it("splits the comma-separated stack field into an array", () => {
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("+ Add Project"));

      fireEvent.change(screen.getByPlaceholderText("STM Styling"), {
        target: { value: "New Project" },
      });
      fireEvent.change(screen.getByPlaceholderText("React, Supabase, Vite"), {
        target: { value: "React, Node, Postgres" },
      });
      fireEvent.click(screen.getByText("Add Project"));

      const saved = AdminStore.saveProjects.mock.calls[0][0][0];
      expect(saved.stack).toEqual(["React", "Node", "Postgres"]);
    });

    it("saves an optional GitHub link (link1) field", () => {
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("+ Add Project"));

      fireEvent.change(screen.getByPlaceholderText("STM Styling"), {
        target: { value: "Linked Project" },
      });
      fireEvent.change(
        screen.getByPlaceholderText("https://github.com/spelzi/project-name"),
        { target: { value: "https://github.com/spelzi/linked-project" } },
      );
      fireEvent.click(screen.getByText("Add Project"));

      const saved = AdminStore.saveProjects.mock.calls[0][0][0];
      expect(saved.link1).toBe("https://github.com/spelzi/linked-project");
    });

    it("appends new projects to the end of the list", () => {
      AdminStore.getProjects.mockReturnValue([
        { id: "p1", title: "First", category: "", stack: [], desc: "", status: "Live", link: "", link1: "" },
      ]);
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("+ Add Project"));
      fireEvent.change(screen.getByPlaceholderText("STM Styling"), {
        target: { value: "Second" },
      });
      fireEvent.click(screen.getByText("Add Project"));

      const saved = AdminStore.saveProjects.mock.calls[0][0];
      expect(saved[0].title).toBe("First");
      expect(saved[1].title).toBe("Second");
    });
  });

  describe("editing a project", () => {
    const existing = {
      id: "p1",
      title: "Existing",
      category: "Frontend",
      stack: ["React"],
      desc: "Desc",
      status: "Live",
      link: "",
      link1: "",
    };

    beforeEach(() => {
      AdminStore.getProjects.mockReturnValue([existing]);
    });

    it("pre-fills the form, joining the stack array back to a string", () => {
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("Edit"));

      expect(screen.getByPlaceholderText("STM Styling")).toHaveValue(
        "Existing",
      );
      expect(
        screen.getByPlaceholderText("React, Supabase, Vite"),
      ).toHaveValue("React");
    });

    it("updates the project in place without duplicating", () => {
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("Edit"));
      fireEvent.change(screen.getByPlaceholderText("STM Styling"), {
        target: { value: "Renamed Project" },
      });
      fireEvent.click(screen.getByText("Save Changes"));

      const saved = AdminStore.saveProjects.mock.calls[0][0];
      expect(saved).toHaveLength(1);
      expect(saved[0].title).toBe("Renamed Project");
      expect(saved[0].id).toBe("p1");
    });
  });

  describe("deleting a project", () => {
    beforeEach(() => {
      AdminStore.getProjects.mockReturnValue([
        { id: "p1", title: "Delete Me", category: "", stack: [], desc: "", status: "Live", link: "", link1: "" },
      ]);
    });

    it("removes the project on confirmed delete", () => {
      render(<AdminPastWork />);
      fireEvent.click(screen.getByText("Delete"));
      fireEvent.click(screen.getAllByText("Delete")[1]);

      expect(AdminStore.saveProjects).toHaveBeenCalledWith([]);
    });
  });
});
