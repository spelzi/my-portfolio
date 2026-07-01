import { describe, it, expect } from "vitest";
import { render, screen, fireEvent, within } from "../test-utils";

// Lottie/Anima isn't used on this page, but bootstrap css + DownloadSection
// pull in PDF assets via Vite's asset pipeline — no mocking needed since the
// test environment resolves them to string paths automatically.
import AboutMe from "../../src/Component/AboutMe";

describe("AboutMe", () => {
  it("renders the page title and bio", () => {
    render(<AboutMe />);
    expect(screen.getByText("Chidiebube")).toBeInTheDocument();
    expect(
      screen.getByText(/passionate and results-driven/i),
    ).toBeInTheDocument();
  });

  it("renders all three skill set cards", () => {
    render(<AboutMe />);
    expect(
      screen.getByRole("heading", { name: "Full Stack Web Developer" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Crypto & Forex Trader" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Business Consultant" }),
    ).toBeInTheDocument();
  });

  it("renders skills within each skill set", () => {
    render(<AboutMe />);
    expect(screen.getByText("ReactJS")).toBeInTheDocument();
    expect(screen.getByText("Smart Money Concepts (SMC)")).toBeInTheDocument();
    expect(screen.getByText("Strategic Growth Planning")).toBeInTheDocument();
  });

  it("renders the LinkedIn CTA", () => {
    render(<AboutMe />);
    const link = screen.getByText("Connect on LinkedIn");
    expect(link).toHaveAttribute(
      "href",
      "https://www.linkedin.com/in/emmanuel-chidiebube-uzor",
    );
  });

  it("renders the Resume and Cover Letter download section", () => {
    render(<AboutMe />);
    expect(screen.getByText("My Documentation")).toBeInTheDocument();
    expect(screen.getByText("Resume")).toBeInTheDocument();
    expect(screen.getByText("Cover Letter")).toBeInTheDocument();
  });

  // ─── Certificates + Lightbox ──────────────────────────────────────────────
  describe("certificates lightbox", () => {
    it("renders all three certificate tiles", () => {
      render(<AboutMe />);
      expect(
        screen.getByText("Full Stack Web Development"),
      ).toBeInTheDocument();
      expect(screen.getByText("SMC Crypto Trading Academy")).toBeInTheDocument();
      expect(
        screen.getByText("Comtemporary Brand indentity design"),
      ).toBeInTheDocument();
    });

    it("opens the lightbox when a certificate tile is clicked", () => {
      render(<AboutMe />);
      fireEvent.click(screen.getByText("SMC Crypto Trading Academy"));

      const dialog = screen.getByRole("dialog");
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute("aria-label", "SMC Crypto Trading Academy");
    });

    it("closes the lightbox via the × button", () => {
      render(<AboutMe />);
      fireEvent.click(screen.getByText("SMC Crypto Trading Academy"));
      fireEvent.click(screen.getByLabelText("Close"));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes the lightbox when the backdrop is clicked", () => {
      render(<AboutMe />);
      fireEvent.click(screen.getByText("SMC Crypto Trading Academy"));
      fireEvent.click(screen.getByRole("dialog"));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("closes the lightbox on Escape key", () => {
      render(<AboutMe />);
      fireEvent.click(screen.getByText("SMC Crypto Trading Academy"));
      fireEvent.keyDown(document, { key: "Escape" });

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });

    it("does not close the lightbox when the image itself is clicked", () => {
      render(<AboutMe />);
      fireEvent.click(screen.getByText("SMC Crypto Trading Academy"));

      const dialog = screen.getByRole("dialog");
      const lightboxImg = within(dialog).getByAltText(
        "SMC Crypto Trading Academy",
      );
      fireEvent.click(lightboxImg);

      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("locks body scroll while the lightbox is open", () => {
      render(<AboutMe />);
      fireEvent.click(screen.getByText("SMC Crypto Trading Academy"));
      expect(document.body.style.overflow).toBe("hidden");

      fireEvent.keyDown(document, { key: "Escape" });
      expect(document.body.style.overflow).toBe("");
    });
  });
});
