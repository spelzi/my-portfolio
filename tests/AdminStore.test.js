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
  // getPosts/getProjects/getVideos and savePosts/saveProjects/saveVideos all
  // share the exact same fetch-based implementation under the hood — see
  // getCollection/saveCollection in AdminStore.jsx — so these three describe
  // blocks intentionally mirror each other.
  describe("getPosts", () => {
    it("returns live data from the API on success", async () => {
      const live = [{ slug: "live-post", title: "Live" }];
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => live,
      });

      const defaults = [{ slug: "default-post", title: "Default" }];
      const result = await AdminStore.getPosts(defaults);

      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/posts`);
      expect(result).toEqual(live);
    });

    it("falls back to defaults when the response is not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 });
      const defaults = [{ slug: "fallback", title: "Fallback" }];

      const result = await AdminStore.getPosts(defaults);
      expect(result).toEqual(defaults);
    });

    it("falls back to defaults on a network error", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("Network down"));
      const defaults = [{ slug: "fallback", title: "Fallback" }];

      const result = await AdminStore.getPosts(defaults);
      expect(result).toEqual(defaults);
    });
  });

  describe("savePosts", () => {
    it("throws when not signed in (no token)", async () => {
      await expect(AdminStore.savePosts([])).rejects.toThrow("Not signed in.");
    });

    it("PUTs to /api/posts with the Bearer token and JSON body", async () => {
      sessionStorage.setItem(TOKEN_KEY, "test-token");
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, count: 1 }),
      });

      const posts = [{ slug: "a", title: "A" }];
      await AdminStore.savePosts(posts);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/posts`,
        expect.objectContaining({
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer test-token",
          },
          body: JSON.stringify(posts),
        })
      );
    });

    it("returns true on success", async () => {
      sessionStorage.setItem(TOKEN_KEY, "test-token");
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ success: true }),
      });

      const result = await AdminStore.savePosts([]);
      expect(result).toBe(true);
    });

    it("throws with the server's error message on failure", async () => {
      sessionStorage.setItem(TOKEN_KEY, "test-token");
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Item 0: slug is required" }),
      });

      await expect(AdminStore.savePosts([{}])).rejects.toThrow("Item 0: slug is required");
    });

    it("throws a generic message if the error response has no body", async () => {
      sessionStorage.setItem(TOKEN_KEY, "test-token");
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => {
          throw new Error("not json");
        },
      });

      await expect(AdminStore.savePosts([])).rejects.toThrow("Save failed (500)");
    });
  });

  // ─── Projects ────────────────────────────────────────────────────────────
  describe("getProjects", () => {
    it("returns live data from the API on success", async () => {
      const live = [{ id: "p1", title: "Live Project" }];
      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => live });

      const result = await AdminStore.getProjects([]);
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/projects`);
      expect(result).toEqual(live);
    });

    it("falls back to defaults on failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("down"));
      const defaults = [{ id: "fallback", title: "Fallback" }];
      expect(await AdminStore.getProjects(defaults)).toEqual(defaults);
    });
  });

  describe("saveProjects", () => {
    it("PUTs to /api/projects with the Bearer token", async () => {
      sessionStorage.setItem(TOKEN_KEY, "test-token");
      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

      await AdminStore.saveProjects([{ id: "p1", title: "P" }]);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/projects`,
        expect.objectContaining({ method: "PUT" })
      );
    });

    it("throws when not signed in", async () => {
      await expect(AdminStore.saveProjects([])).rejects.toThrow("Not signed in.");
    });
  });

  // ─── Videos ──────────────────────────────────────────────────────────────
  describe("getVideos", () => {
    it("returns live data from the API on success", async () => {
      const live = [{ id: "v1", title: "Live Video" }];
      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => live });

      const result = await AdminStore.getVideos([]);
      expect(fetch).toHaveBeenCalledWith(`${API_URL}/api/videos`);
      expect(result).toEqual(live);
    });

    it("falls back to defaults on failure", async () => {
      global.fetch = vi.fn().mockRejectedValue(new Error("down"));
      const defaults = [{ id: "fallback", title: "Fallback" }];
      expect(await AdminStore.getVideos(defaults)).toEqual(defaults);
    });
  });

  describe("saveVideos", () => {
    it("PUTs to /api/videos with the Bearer token", async () => {
      sessionStorage.setItem(TOKEN_KEY, "test-token");
      global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) });

      await AdminStore.saveVideos([{ id: "v1", title: "V" }]);

      expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/api/videos`,
        expect.objectContaining({ method: "PUT" })
      );
    });

    it("throws when not signed in", async () => {
      await expect(AdminStore.saveVideos([])).rejects.toThrow("Not signed in.");
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
        })
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
