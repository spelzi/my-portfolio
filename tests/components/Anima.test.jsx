import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";

// Stub lottie-react itself — Anima's only job is dynamically importing it
// and passing animationData through. The actual lottie rendering engine
// (canvas/SVG playback) is out of scope for a unit test and isn't reliably
// supported in jsdom.
vi.mock("lottie-react", () => ({
  default: ({ animationData }) => (
    <div data-testid="lottie-mock" data-has-animation={Boolean(animationData)} />
  ),
}));

import Anima from "../../src/Component/Anima";

describe("Anima", () => {
  it("renders the .anima container immediately, before the player loads", () => {
    const { container } = render(<Anima />);
    expect(container.querySelector(".anima")).toBeInTheDocument();
  });

  it("dynamically loads the player and passes animation data through", async () => {
    render(<Anima />);
    const lottie = await screen.findByTestId("lottie-mock");
    expect(lottie).toHaveAttribute("data-has-animation", "true");
  });
});
