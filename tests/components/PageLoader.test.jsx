import { describe, it, expect } from "vitest";
import { render, screen } from "../test-utils";
import PageLoader from "../../src/Component/PageLoader";

describe("PageLoader", () => {
  it("has the correct ARIA role and label", () => {
    render(<PageLoader />);
    const loader = screen.getByRole("status");
    expect(loader).toHaveAttribute("aria-label", "Loading");
  });

  it("renders the brand mark text", () => {
    render(<PageLoader />);
    expect(screen.getByText("St Manuel")).toBeInTheDocument();
  });

  it("does NOT have is-fading class when fadingOut is false", () => {
    render(<PageLoader fadingOut={false} />);
    expect(screen.getByRole("status")).not.toHaveClass("is-fading");
  });

  it("has is-fading class when fadingOut is true", () => {
    render(<PageLoader fadingOut={true} />);
    expect(screen.getByRole("status")).toHaveClass("is-fading");
  });

  it("has the base page-loader class in both states", () => {
    const { rerender } = render(<PageLoader fadingOut={false} />);
    expect(screen.getByRole("status")).toHaveClass("page-loader");

    rerender(<PageLoader fadingOut={true} />);
    expect(screen.getByRole("status")).toHaveClass("page-loader");
  });
});
