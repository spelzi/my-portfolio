const ADMIN_PWD = import.meta.env.VITE_ADMIN_PASSWORD;
if (!ADMIN_PWD) throw new Error("[AdminStore] VITE_ADMIN_PASSWORD is not set.");
const SESSION_KEY = "stm_admin_session";
const KEYS = {
  posts: "stm_blog_posts",
  projects: "stm_projects",
  videos: "stm_videos",
};

// FIX 1: read() was missing entirely — restored and using `fallback` param
const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (e) {
    console.error(`[AdminStore] Failed to read "${key}":`, e);
    return fallback;
  }
};

// FIX 2: empty catch{} replaced with actual error logging
const write = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.error(`[AdminStore] Failed to write "${key}":`, e);
  }
};

export const AdminStore = {
  /* ─── Auth ─── */
  login: (pwd) => {
    const ok = pwd === ADMIN_PWD;
    if (ok) sessionStorage.setItem(SESSION_KEY, "1");
    return ok;
  },
  logout: () => sessionStorage.removeItem(SESSION_KEY),
  isAuthed: () => sessionStorage.getItem(SESSION_KEY) === "1",

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
