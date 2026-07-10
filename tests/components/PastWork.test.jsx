import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import { MemoryRouter } from "react-router-dom";
import PastWork from "../../src/Component/PastWork";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getProjects: vi.fn((defaults) => Promise.resolve(defaults)),
  },
}));

const renderPastWork = () =>
  render(
    <MemoryRouter>
      <PastWork />
    </MemoryRouter>,
  );

describe("PastWork", () => {
  it("renders the section title and label", () => {
    renderPastWork();
    expect(screen.getByText("Selected Work")).toBeInTheDocument();
    expect(screen.getByText("Portfolio")).toBeInTheDocument();
  });

  it("renders all default project titles", () => {
    renderPastWork();
    expect(screen.getByText("STM Styling")).toBeInTheDocument();
    expect(screen.getByText("Personal Portfolio")).toBeInTheDocument();
    expect(screen.getByText("Trading Dashboard")).toBeInTheDocument();
  });

  it("renders zero-padded index numbers", () => {
    renderPastWork();
    expect(screen.getByText("01")).toBeInTheDocument();
    expect(screen.getByText("02")).toBeInTheDocument();
    expect(screen.getByText("03")).toBeInTheDocument();
  });

  it("renders tech stack tags", () => {
    renderPastWork();
    expect(screen.getAllByText("React").length).toBeGreaterThan(0);
    expect(screen.getByText("Vite")).toBeInTheDocument();
    expect(screen.getByText("Supabase")).toBeInTheDocument();
  });

  it("renders project categories", () => {
    renderPastWork();
    expect(screen.getByText("Full Stack E-Commerce")).toBeInTheDocument();
    expect(screen.getByText("Frontend / UI")).toBeInTheDocument();
    expect(screen.getByText("Frontend / Data Viz")).toBeInTheDocument();
  });

  it("renders project status badges", () => {
    renderPastWork();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Live")).toBeInTheDocument();
    expect(screen.getByText("Coming Soon")).toBeInTheDocument();
  });

  it("renders project descriptions", () => {
    renderPastWork();
    expect(
      screen.getByText(/luxury fashion e-commerce platform/i),
    ).toBeInTheDocument();
  });

  it("renders 'View Project' link when project has a live URL", () => {
    renderPastWork();
    const viewLinks = screen.getAllByText("View Project");
    expect(viewLinks.length).toBeGreaterThan(0);
  });

  it("shows empty state when no projects exist", async () => {
    AdminStore.getProjects.mockResolvedValueOnce([]);

    render(
      <MemoryRouter>
        <PastWork />
      </MemoryRouter>,
    );
    // The component renders defaultProjects first, then swaps to the
    // resolved (empty) list once the mocked fetch resolves — findByText
    // waits for that update instead of asserting on the first paint.
    expect(await screen.findByText("No projects added yet.")).toBeInTheDocument();
  });
});
