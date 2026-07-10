const API_URL = import.meta.env.VITE_BACKEND_URL;
const SESSION_KEY = "stm_admin_token";

/**
 * Content (posts/projects/videos) is now backed by the Supabase-powered
 * Express API, not localStorage — so admin edits are visible to every
 * visitor, not just the device that made them.
 *
 * getX(defaults) never throws: on any network failure it logs and falls
 * back to `defaults`, so the site degrades gracefully instead of breaking
 * if the backend is ever briefly unreachable.
 *
 * saveX(data) DOES throw on failure (unlike the old localStorage version,
 * which never failed) — callers must handle that, since a network save can
 * genuinely fail in ways a local write never could.
 */
const getCollection = async (path, defaults) => {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) throw new Error(`Request failed (${res.status})`);
    return await res.json();
  } catch (e) {
    console.error(`[AdminStore] Failed to load ${path}:`, e);
    return defaults;
  }
};

const saveCollection = async (path, data) => {
  const token = sessionStorage.getItem(SESSION_KEY);
  if (!token) throw new Error("Not signed in.");

  const res = await fetch(`${API_URL}${path}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Save failed (${res.status})`);
  }

  return true;
};

export const AdminStore = {
  /* ─── Auth ─── */
  login: async (pwd) => {
    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      if (!res.ok) return false;
      const { token } = await res.json();
      sessionStorage.setItem(SESSION_KEY, token);
      return true;
    } catch (e) {
      console.error("[AdminStore] Login failed:", e);
      return false;
    }
  },

  logout: () => sessionStorage.removeItem(SESSION_KEY),

  // Checks token exists + hasn't expired (JWT expiry is in the payload)
  isAuthed: () => {
    const token = sessionStorage.getItem(SESSION_KEY);
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  },

  getToken: () => sessionStorage.getItem(SESSION_KEY),

  /* ─── Blog posts ─── */
  getPosts: (defaults) => getCollection("/api/posts", defaults),
  savePosts: (data) => saveCollection("/api/posts", data),

  /* ─── Projects ─── */
  getProjects: (defaults) => getCollection("/api/projects", defaults),
  saveProjects: (data) => saveCollection("/api/projects", data),

  /* ─── Videos ─── */
  getVideos: (defaults) => getCollection("/api/videos", defaults),
  saveVideos: (data) => saveCollection("/api/videos", data),
};
