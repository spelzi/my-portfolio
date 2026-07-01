import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "../test-utils";
import { MemoryRouter } from "react-router-dom";
import MainNav from "../../src/Component/MainNav";

// Vite turns image imports into path strings in test env — no explicit mock needed
// but we stub the module to keep tests deterministic across environments.
vi.mock("../../src/Component/image/St Manuel copy.png", () => ({
  default: "st-manuel-logo.png",
}));

const renderNav = (route = "/") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <MainNav />
    </MemoryRouter>,
  );

describe("MainNav", () => {
  it("renders all five navigation links", () => {
    renderNav();
    ["Home", "About", "Work", "Blog", "Videos"].forEach((label) =>
      expect(screen.getByText(label)).toBeInTheDocument(),
    );
  });

  it("renders the logo image", () => {
    renderNav();
    expect(screen.getByAltText("St Manuel logo")).toBeInTheDocument();
  });

  it("logo links to the home route", () => {
    renderNav();
    const logoLink = screen.getByRole("link", { name: /st manuel — home/i });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  // ─── Active link ──────────────────────────────────────────────────────────
  it("marks the Home link as active on /", () => {
    renderNav("/");
    expect(screen.getByText("Home").closest("a")).toHaveClass("active");
    expect(screen.getByText("About").closest("a")).not.toHaveClass("active");
  });

  it("marks the Blog link as active on /blog", () => {
    renderNav("/blog");
    expect(screen.getByText("Blog").closest("a")).toHaveClass("active");
    expect(screen.getByText("Home").closest("a")).not.toHaveClass("active");
  });

  it("marks the Work link as active on /pastwork", () => {
    renderNav("/pastwork");
    expect(screen.getByText("Work").closest("a")).toHaveClass("active");
  });

  // ─── Mobile hamburger ─────────────────────────────────────────────────────
  it("hamburger button starts closed (aria-expanded=false)", () => {
    renderNav();
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("hamburger opens the menu on click", () => {
    renderNav();
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("button", { name: /close menu/i })).toBeInTheDocument();
  });

  it("closes the menu on a second click (toggle)", () => {
    renderNav();
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(hamburger); // open
    fireEvent.click(screen.getByRole("button", { name: /close menu/i })); // close
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("closes the menu when Escape is pressed", () => {
    renderNav();
    const hamburger = screen.getByRole("button", { name: /open menu/i });
    fireEvent.click(hamburger);
    expect(hamburger).toHaveAttribute("aria-expanded", "true");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(hamburger).toHaveAttribute("aria-expanded", "false");
  });

  it("nav has correct aria attributes", () => {
    renderNav();
    expect(screen.getByRole("navigation")).toHaveAttribute(
      "aria-label",
      "Main navigation",
    );
  });
});
