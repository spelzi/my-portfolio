import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "../test-utils";
import AdminLogin from "../../src/Component/Admin/AdminLogin";
import { AdminStore } from "../../src/Component/Admin/AdminStore";

vi.mock("../../src/Component/Admin/AdminStore", () => ({
  AdminStore: {
    login: vi.fn(),
  },
}));

describe("AdminLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders password field and submit button", () => {
    render(<AdminLogin onSuccess={vi.fn()} />);
    expect(screen.getByPlaceholderText("••••••••")).toBeInTheDocument();
    expect(screen.getByText("Sign In")).toBeInTheDocument();
  });

  it("calls AdminStore.login with the entered password on submit", async () => {
    AdminStore.login.mockResolvedValue(true);
    render(<AdminLogin onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "supersecret" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() =>
      expect(AdminStore.login).toHaveBeenCalledWith("supersecret"),
    );
  });

  it("calls onSuccess when login succeeds", async () => {
    AdminStore.login.mockResolvedValue(true);
    const onSuccess = vi.fn();
    render(<AdminLogin onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "right-password" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() => expect(onSuccess).toHaveBeenCalledOnce());
  });

  it("shows an error message and does not call onSuccess on failed login", async () => {
    AdminStore.login.mockResolvedValue(false);
    const onSuccess = vi.fn();
    render(<AdminLogin onSuccess={onSuccess} />);

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() =>
      expect(
        screen.getByText("Incorrect password. Try again."),
      ).toBeInTheDocument(),
    );
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it("clears the error message as soon as the user types again", async () => {
    AdminStore.login.mockResolvedValue(false);
    render(<AdminLogin onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    await waitFor(() =>
      expect(
        screen.getByText("Incorrect password. Try again."),
      ).toBeInTheDocument(),
    );

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrong2" },
    });

    expect(
      screen.queryByText("Incorrect password. Try again."),
    ).not.toBeInTheDocument();
  });

  it("disables the input and submit button while loading", async () => {
    let resolveLogin;
    AdminStore.login.mockReturnValue(
      new Promise((res) => {
        resolveLogin = res;
      }),
    );
    render(<AdminLogin onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByText("Sign In"));

    expect(screen.getByPlaceholderText("••••••••")).toBeDisabled();

    // Resolve as a FAILED login — a successful login intentionally never
    // clears `loading` itself, since onSuccess() unmounts AdminLogin in the
    // real app (AdminPanel swaps to the dashboard). The failure path is what
    // re-enables the form for another attempt.
    resolveLogin(false);
    await waitFor(() =>
      expect(screen.getByPlaceholderText("••••••••")).not.toBeDisabled(),
    );
  });

  it("does not submit twice if already loading", async () => {
    let resolveLogin;
    AdminStore.login.mockReturnValue(
      new Promise((res) => {
        resolveLogin = res;
      }),
    );
    render(<AdminLogin onSuccess={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "secret" },
    });
    fireEvent.click(screen.getByText("Sign In"));
    fireEvent.click(screen.getByText("Sign In")); // double-submit attempt

    expect(AdminStore.login).toHaveBeenCalledTimes(1);
    resolveLogin(true);
  });
});
