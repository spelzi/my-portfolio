import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "../test-utils";
import LoadingButton from "../../src/Component/LoadingButton";

describe("LoadingButton", () => {
  it("renders children text", () => {
    render(<LoadingButton>Save</LoadingButton>);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("is not loading and not disabled by default", () => {
    render(<LoadingButton>Click</LoadingButton>);
    const btn = screen.getByRole("button");
    expect(btn).not.toHaveClass("is-loading");
    expect(btn).not.toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "false");
  });

  // ─── Controlled mode (loading prop) ──────────────────────────────────────
  describe("controlled loading (via loading prop)", () => {
    it("shows spinner and disables button when loading=true", () => {
      render(<LoadingButton loading={true}>Save</LoadingButton>);
      const btn = screen.getByRole("button");
      expect(btn).toHaveClass("is-loading");
      expect(btn).toBeDisabled();
      expect(btn).toHaveAttribute("aria-busy", "true");
    });

    it("hides spinner when loading=false", () => {
      render(<LoadingButton loading={false}>Save</LoadingButton>);
      const btn = screen.getByRole("button");
      expect(btn).not.toHaveClass("is-loading");
      expect(btn).not.toBeDisabled();
    });

    it("still fires onClick in controlled mode when not loading", () => {
      const handler = vi.fn();
      render(<LoadingButton loading={false} onClick={handler}>Click</LoadingButton>);
      fireEvent.click(screen.getByRole("button"));
      expect(handler).toHaveBeenCalledOnce();
    });

    it("blocks click when controlled loading=true", () => {
      const handler = vi.fn();
      render(<LoadingButton loading={true} onClick={handler}>Click</LoadingButton>);
      fireEvent.click(screen.getByRole("button"));
      expect(handler).not.toHaveBeenCalled();
    });
  });

  // ─── Self-managed mode (onClick async) ───────────────────────────────────
  describe("self-managed loading (via async onClick)", () => {
    it("shows spinner while onClick promise is pending, hides it after resolve", async () => {
      let resolve;
      const handler = vi.fn(() => new Promise((r) => { resolve = r; }));

      render(<LoadingButton onClick={handler} minDuration={0}>Go</LoadingButton>);
      fireEvent.click(screen.getByRole("button"));

      // setInternalLoading(true) happens synchronously before awaiting the promise
      expect(screen.getByRole("button")).toHaveClass("is-loading");

      resolve();
      await waitFor(() =>
        expect(screen.getByRole("button")).not.toHaveClass("is-loading"),
      );
    });

    it("prevents double-click while loading", () => {
      let resolve;
      const handler = vi.fn(() => new Promise((r) => { resolve = r; }));

      render(<LoadingButton onClick={handler} minDuration={0}>Go</LoadingButton>);
      fireEvent.click(screen.getByRole("button"));
      fireEvent.click(screen.getByRole("button")); // second click should be blocked

      expect(handler).toHaveBeenCalledOnce();
      resolve();
    });

    it("respects minDuration before hiding spinner", async () => {
      vi.useFakeTimers();
      const handler = vi.fn().mockResolvedValue(undefined);

      render(<LoadingButton onClick={handler} minDuration={500}>Go</LoadingButton>);
      fireEvent.click(screen.getByRole("button"));

      // Let the resolved promise's microtask (the .finally() callback) run,
      // which is what schedules the setTimeout we're about to advance.
      await act(async () => {
        await Promise.resolve();
      });

      // Handler resolves instantly, but minDuration hasn't passed
      await act(async () => {
        vi.advanceTimersByTime(499);
      });
      expect(screen.getByRole("button")).toHaveClass("is-loading");

      await act(async () => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByRole("button")).not.toHaveClass("is-loading");

      vi.useRealTimers();
    });
  });

  // ─── Polymorphic (as prop) ────────────────────────────────────────────────
  it("renders as an anchor element when as='a'", () => {
    render(
      <LoadingButton as="a" href="/test">
        Link
      </LoadingButton>,
    );
    const anchor = screen.getByRole("link", { name: /link/i });
    expect(anchor).toBeInTheDocument();
    expect(anchor.tagName).toBe("A");
    expect(anchor).toHaveAttribute("href", "/test");
  });

  it("does not set disabled on non-button elements", () => {
    render(<LoadingButton as="a" loading={true}>Link</LoadingButton>);
    const anchor = screen.getByText("Link").closest("a");
    expect(anchor).not.toHaveAttribute("disabled");
  });

  // ─── Extra className ──────────────────────────────────────────────────────
  it("appends extra classNames alongside btn-loading", () => {
    render(<LoadingButton className="my-class">X</LoadingButton>);
    const btn = screen.getByRole("button");
    expect(btn).toHaveClass("btn-loading");
    expect(btn).toHaveClass("my-class");
  });
});
