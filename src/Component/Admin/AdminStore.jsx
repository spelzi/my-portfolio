const API_URL = import.meta.env.VITE_BACKEND_URL;
const SESSION_KEY = "stm_admin_token";

const hasStorage = typeof localStorage !== "undefined";

const read = (key, fallback) => {
  if (!hasStorage) return fallback; // SSR/prerender — no browser storage, use defaults
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`[AdminStore] Failed to read "${key}":`, e);
    return fallback;
  }
};

const write = (key, data) => {
  if (!hasStorage) return; // no-op during SSR/prerender
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[AdminStore] Failed to write "${key}":`, e);
  }
};

const KEYS = {
  posts: "stm_blog_posts",
  projects: "stm_projects",
  videos: "stm_videos",
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
  getPosts: (defaults) => read(KEYS.posts, null) ?? defaults,
  savePosts: (data) => write(KEYS.posts, data),

  /* ─── Projects ─── */
  getProjects: (defaults) => read(KEYS.projects, null) ?? defaults,
  saveProjects: (data) => write(KEYS.projects, data),

  /* ─── Videos ─── */
  getVideos: (defaults) => read(KEYS.videos, null) ?? defaults,
  saveVideos: (data) => write(KEYS.videos, data),
};
