import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import Contact from "../../src/Component/Contact";

beforeEach(() => {
  vi.stubEnv("VITE_BACKEND_URL", "http://localhost:3001");
  global.fetch = vi.fn();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

// NOTE: we submit via fireEvent.submit(form) rather than clicking the
// submit button. The button has no onClick — it relies on the browser's
// native "click a submit button -> fire form submit" behavior, which this
// jsdom version does not reliably simulate via fireEvent.click(). Submitting
// the form directly exercises the exact same onSubmit={sendEmail} handler
// and is the standard RTL pattern for forms with no button onClick.
const fillForm = ({ name = "Jane Doe", email = "jane@example.com", message = "Hello!" } = {}) => {
  fireEvent.change(screen.getByPlaceholderText("Your name"), {
    target: { value: name },
  });
  fireEvent.change(screen.getByPlaceholderText("Your email"), {
    target: { value: email },
  });
  fireEvent.change(screen.getByPlaceholderText("Your message"), {
    target: { value: message },
  });
};

const submitForm = (container) => fireEvent.submit(container.querySelector("form"));

describe("Contact form", () => {
  it("renders all three fields and a submit button", () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText("Your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Your message")).toBeInTheDocument();
    expect(screen.getByText("Send Message")).toBeInTheDocument();
  });

  // ─── Validation ───────────────────────────────────────────────────────────
  describe("validation", () => {
    it("shows errors when submitting an empty form", () => {
      const { container } = render(<Contact />);
      submitForm(container);

      expect(screen.getByText("Name is required.")).toBeInTheDocument();
      expect(screen.getByText("Email is required.")).toBeInTheDocument();
      expect(screen.getByText("Message is required.")).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("rejects an invalid email format", () => {
      const { container } = render(<Contact />);
      fillForm({ email: "not-an-email" });
      submitForm(container);

      expect(
        screen.getByText("Please enter a valid email."),
      ).toBeInTheDocument();
      expect(fetch).not.toHaveBeenCalled();
    });

    it("accepts a valid email and clears prior errors on resubmit", async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      const { container } = render(<Contact />);

      // First: trigger errors
      submitForm(container);
      expect(screen.getByText("Name is required.")).toBeInTheDocument();

      // Then: fill correctly and resubmit
      fillForm();
      submitForm(container);

      await waitFor(() =>
        expect(screen.queryByText("Name is required.")).not.toBeInTheDocument(),
      );
    });
  });

  // ─── Submission ───────────────────────────────────────────────────────────
  describe("successful submission", () => {
    it("POSTs the form data to BACKEND_URL/send-email", async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      const { container } = render(<Contact />);
      fillForm({ name: "Jane Doe", email: "jane@example.com", message: "Hi" });
      submitForm(container);

      await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:3001/send-email",
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            from_name: "Jane Doe",
            from_email: "jane@example.com",
            message: "Hi",
          }),
        }),
      );
    });

    it("shows a success modal and clears the form on success", async () => {
      fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
      const { container } = render(<Contact />);
      fillForm();
      submitForm(container);

      await waitFor(() =>
        expect(screen.getByText("Message Sent")).toBeInTheDocument(),
      );
      expect(screen.getByPlaceholderText("Your name")).toHaveValue("");
    });

    it("disables inputs and shows 'Sending...' while in flight", async () => {
      let resolveFetch;
      fetch.mockReturnValue(
        new Promise((res) => {
          resolveFetch = res;
        }),
      );
      const { container } = render(<Contact />);
      fillForm();
      submitForm(container);

      expect(screen.getByText("Sending...")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Your name")).toBeDisabled();

      resolveFetch({ ok: true, json: async () => ({}) });
      await waitFor(() =>
        expect(screen.getByText("Message Sent")).toBeInTheDocument(),
      );
    });
  });

  // ─── Failure paths ────────────────────────────────────────────────────────
  describe("error handling", () => {
    it("shows server error message on non-OK response", async () => {
      fetch.mockResolvedValue({
        ok: false,
        json: async () => ({ error: "Bad request" }),
      });
      const { container } = render(<Contact />);
      fillForm();
      submitForm(container);

      await waitFor(() =>
        expect(
          screen.getByText(/Could not send message: Bad request/i),
        ).toBeInTheDocument(),
      );
    });

    it("shows network-unreachable message on fetch rejection", async () => {
      fetch.mockRejectedValue(new Error("Network down"));
      const { container } = render(<Contact />);
      fillForm();
      submitForm(container);

      await waitFor(() =>
        expect(
          screen.getByText(/Server unreachable\. Please try again later\./i),
        ).toBeInTheDocument(),
      );
    });

    it("shows a timeout message on AbortError", async () => {
      const abortError = new Error("Aborted");
      abortError.name = "AbortError";
      fetch.mockRejectedValue(abortError);
      const { container } = render(<Contact />);
      fillForm();
      submitForm(container);

      await waitFor(() =>
        expect(screen.getByText(/Request timed out/i)).toBeInTheDocument(),
      );
    });

    it("re-enables the form after an error so the user can retry", async () => {
      fetch.mockRejectedValue(new Error("Network down"));
      const { container } = render(<Contact />);
      fillForm();
      submitForm(container);

      await waitFor(() =>
        expect(screen.getByPlaceholderText("Your name")).not.toBeDisabled(),
      );
    });
  });

  // ─── Modal dismissal ──────────────────────────────────────────────────────
  it("closes the modal when Close is clicked", async () => {
    fetch.mockResolvedValue({ ok: true, json: async () => ({}) });
    const { container } = render(<Contact />);
    fillForm();
    submitForm(container);

    await waitFor(() =>
      expect(screen.getByText("Message Sent")).toBeInTheDocument(),
    );
    fireEvent.click(screen.getByText("Close"));

    await waitFor(() =>
      expect(screen.queryByText("Message Sent")).not.toBeInTheDocument(),
    );
  });
});
