import { describe, it, expect, vi, beforeEach } from "vitest";
import { AdminStore } from "../src/Component/Admin/AdminStore";

// NOTE: Vite statically replaces `import.meta.env.VITE_*` at build time, so
// vi.stubEnv() has no effect on AdminStore's already-built API_URL constant.
// We read the real configured value instead of trying to override it.
const API_URL = import.meta.env.VITE_BACKEND_URL;

const TOKEN_KEY = "stm_admin_token";

// ─── Helpers ─────────────────────────────────────────────────────────────────
const makeJwt = (expOffsetSeconds) => {
  const exp = Math.floor(Date.now() / 1000) + expOffsetSeconds;
  const payload = btoa(JSON.stringify({ exp }));
  return `header.${payload}.signature`;
};

describe("AdminStore", () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  // ─── Blog Posts ─────────────────────────────────────────────────────────
  describe("getPosts / savePosts", () => {
    it("returns defaults when nothing is stored", () => {
      const defaults = [{ slug: "a", title: "A" }];
      expect(AdminStore.getPosts(defaults)).toEqual(defaults);
    });

    it("returns saved posts and ignores defaults", () => {
      const saved = [{ slug: "b", title: "B" }];
      AdminStore.savePosts(saved);
      expect(AdminStore.getPosts([{ slug: "default" }])).toEqual(saved);
    });

    it("handles corrupted localStorage data gracefully", () => {
      localStorage.setItem("stm_blog_posts", "NOT_JSON{{{{");
      const defaults = [{ slug: "fallback" }];
      expect(AdminStore.getPosts(defaults)).toEqual(defaults);
    });
  });

  // ─── Projects ────────────────────────────────────────────────────────────
  describe("getProjects / saveProjects", () => {
    it("returns defaults when nothing is stored", () => {
      const defaults = [{ id: "p1", title: "P" }];
      expect(AdminStore.getProjects(defaults)).toEqual(defaults);
    });

    it("returns saved projects", () => {
      const saved = [{ id: "p2", title: "Saved" }];
      AdminStore.saveProjects(saved);
      expect(AdminStore.getProjects([])).toEqual(saved);
    });
  });

  // ─── Videos ──────────────────────────────────────────────────────────────
  describe("getVideos / saveVideos", () => {
    it("returns defaults when nothing is stored", () => {
      const defaults = [{ id: "v1", title: "V" }];
      expect(AdminStore.getVideos(defaults)).toEqual(defaults);
    });

    it("returns saved videos", () => {
      const saved = [{ id: "v2", title: "Saved Video" }];
      AdminStore.saveVideos(saved);
      expect(AdminStore.getVideos([])).toEqual(saved);
    });
  });

  // ─── Auth ────────────────────────────────────────────────────────────────
  describe("isAuthed", () => {
    it("returns false when no token is present", () => {
      expect(AdminStore.isAuthed()).toBe(false);
    });

    it("returns false when token is malformed", () => {
      sessionStorage.setItem(TOKEN_KEY, "not.a.valid.jwt");
      expect(AdminStore.isAuthed()).toBe(false);
    });

    it("returns true with a valid, non-expired token", () => {
      sessionStorage.setItem(TOKEN_KEY, makeJwt(3600)); // expires in 1 hour
      expect(AdminStore.isAuthed()).toBe(true);
    });

    it("returns false with an expired token", () => {
      sessionStorage.setItem(TOKEN_KEY, makeJwt(-3600)); // expired 1 hour ago
      expect(AdminStore.isAuthed()).toBe(false);
    });
  });

  describe("getToken", () => {
    it("returns null when no token is stored", () => {
      expect(AdminStore.getToken()).toBeNull();
    });

    it("returns the stored token", () => {
      const token = makeJwt(3600);
      sessionStorage.setItem(TOKEN_KEY, token);
      expect(AdminStore.getToken()).toBe(token);
    });
  });

  describe("logout", () => {
    it("removes the token from sessionStorage", () => {
      sessionStorage.setItem(TOKEN_KEY, makeJwt(3600));
      AdminStore.logout();
      expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it("does nothing when already logged out", () => {
      expect(() => AdminStore.logout()).not.toThrow();
    });
  });

  describe("login", () => {
    it("POSTs to /api/auth/login with the password", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token: makeJwt(3600) }),
      });

      await AdminStore.login("secret");

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/auth/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: "secret" }),
        }),
      );
    });

    it("stores the token in sessionStorage on success", async () => {
      const token = makeJwt(3600);
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ token }),
      });

      const result = await AdminStore.login("secret");
      expect(result).toBe(true);
      expect(sessionStorage.getItem(TOKEN_KEY)).toBe(token);
    });

    it("returns false and stores no token on bad credentials", async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false });
      const result = await AdminStore.login("wrong");
      expect(result).toBe(false);
      expect(sessionStorage.getItem(TOKEN_KEY)).toBeNull();
    });

    it("returns false on network failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network down"));
      const result = await AdminStore.login("secret");
      expect(result).toBe(false);
    });
  });
});
