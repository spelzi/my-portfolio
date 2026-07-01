import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import { MemoryRouter } from "react-router-dom";
import Blog from "../../src/Component/Blog";

// Let AdminStore return the real default posts (no localStorage in tests)
vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    getPosts: vi.fn((defaults) => defaults),
  },
}));

const renderBlog = () =>
  render(
    <MemoryRouter>
      <Blog />
    </MemoryRouter>,
  );

describe("Blog", () => {
  it("renders the section title and tagline", () => {
    renderBlog();
    expect(screen.getByText("Thoughts & Insights")).toBeInTheDocument();
    expect(screen.getByText("Journal")).toBeInTheDocument();
  });

  it("renders all default blog post titles", () => {
    renderBlog();
    expect(
      screen.getByText("Understanding Smart Money Concepts in Forex"),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        "Building a Full Stack E-Commerce App with React & Supabase",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Digital Strategy for Entrepreneurs in 2025"),
    ).toBeInTheDocument();
  });

  it("each card links to the correct /blog/:slug route", () => {
    renderBlog();
    const smcLink = screen
      .getByText("Understanding Smart Money Concepts in Forex")
      .closest("a");
    expect(smcLink).toHaveAttribute(
      "href",
      "/blog/understanding-smart-money-concepts-forex",
    );

    const ecomLink = screen
      .getByText(
        "Building a Full Stack E-Commerce App with React & Supabase",
      )
      .closest("a");
    expect(ecomLink).toHaveAttribute(
      "href",
      "/blog/building-full-stack-ecommerce-react-supabase",
    );
  });

  it("renders category badges", () => {
    renderBlog();
    // There should be multiple Trading, Web Dev, and Business badges
    expect(screen.getAllByText("Trading").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Web Dev").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Business").length).toBeGreaterThanOrEqual(1);
  });

  it("renders read-time labels", () => {
    renderBlog();
    expect(screen.getByText("8 min read")).toBeInTheDocument();
    expect(screen.getByText("12 min read")).toBeInTheDocument();
  });

  it("renders post dates", () => {
    renderBlog();
    expect(screen.getByText("Mar 2025")).toBeInTheDocument();
    expect(screen.getByText("Feb 2025")).toBeInTheDocument();
  });
});
