import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../test-utils";
import { MemoryRouter } from "react-router-dom";
import Home from "../../src/Component/Home";

// Anima wraps lottie-react, which needs real animation JSON + DOM measurement
// APIs jsdom doesn't fully implement. The component itself has no logic of
// its own to test — it's a thin lottie-react wrapper — so we stub it here
// and cover it separately with its own lightweight unit test.
vi.mock("../../src/Component/Anima", () => ({
  default: () => <div data-testid="anima-stub" />,
}));

const renderHome = () =>
  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

describe("Home", () => {
  it("renders the hero name and roles", () => {
    renderHome();
    expect(screen.getByText("Manuel")).toBeInTheDocument();
    expect(screen.getByText(/Web Developer/)).toBeInTheDocument();
    expect(screen.getByText(/Crypto & Forex Trader/)).toBeInTheDocument();
    expect(screen.getByText(/Business Consultant/)).toBeInTheDocument();
  });

  it("renders hero CTA links to the correct routes", () => {
    renderHome();
    expect(screen.getByText("View My Work").closest("a")).toHaveAttribute("href", "/pastwork");
    expect(screen.getByText("About Me").closest("a")).toHaveAttribute("href", "/aboutme");
  });

  it("renders the about snapshot section with full name", () => {
    renderHome();
    // "Uzor Emmanuel" and "Chidiebube" sit in the same <h2> separated by a
    // <br/>, so React Testing Library splits them into separate text nodes —
    // match on the heading's combined textContent instead.
    expect(
      screen.getByRole("heading", {
        name: /uzor emmanuel\s*chidiebube/i,
        level: 2,
      })
    ).toBeInTheDocument();
  });

  it("renders the experience and education cards", () => {
    renderHome();
    expect(screen.getByText("Experience")).toBeInTheDocument();
    expect(screen.getByText("Education")).toBeInTheDocument();
    expect(screen.getByText("Diploma in Full Stack Web Development")).toBeInTheDocument();
  });

  it("renders the profile sidebar contact details", () => {
    renderHome();
    expect(screen.getByText("emmanueluzor1808@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("Ikeja, Lagos")).toBeInTheDocument();
    expect(screen.getByText("Nigeria")).toBeInTheDocument();
  });

  it("renders social links with correct hrefs", () => {
    renderHome();
    expect(screen.getByLabelText("GitHub")).toHaveAttribute("href", "https://github.com/spelzi");
    expect(screen.getByLabelText("Telegram")).toHaveAttribute("href", "https://t.me/stmempire");
    expect(screen.getByLabelText("X / Twitter")).toHaveAttribute(
      "href",
      "https://x.com/st_manuel1"
    );
  });

  it("renders the embedded Contact form", () => {
    renderHome();
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  it("renders a Full Profile link to /aboutme", () => {
    renderHome();
    expect(screen.getByText(/Full Profile/).closest("a")).toHaveAttribute("href", "/aboutme");
  });
});
