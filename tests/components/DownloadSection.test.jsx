import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import DownloadSection from "../../src/Component/DownloadSection";

describe("DownloadSection", () => {
  it("renders both Resume and Cover Letter sections", () => {
    render(<DownloadSection />);
    expect(screen.getByText("Resume")).toBeInTheDocument();
    expect(screen.getByText("Cover Letter")).toBeInTheDocument();
  });

  it("renders an embedded PDF viewer for each document", () => {
    const { container } = render(<DownloadSection />);
    const embeds = container.querySelectorAll("embed[type='application/pdf']");
    expect(embeds).toHaveLength(2);
  });

  it("renders 'Open PDF in New Tab' links that open in a new tab safely", () => {
    render(<DownloadSection />);
    const links = screen.getAllByText("Open PDF in New Tab");
    expect(links).toHaveLength(2);
    links.forEach((link) => {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    });
  });
});
