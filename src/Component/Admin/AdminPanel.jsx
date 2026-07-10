import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import LoadingButton from "../LoadingButton";
import { posts as defaultPosts } from "../postsData";
import { defaultVideos } from "../videosData";
import AdminBlog from "./AdminBlog";
import AdminDashboard from "./AdminDashboard";
import AdminLogin from "./AdminLogin";
import AdminPastWork, { defaultProjects } from "./AdminPastWork";
import { AdminStore } from "./AdminStore";
import AdminVideos from "./AdminVideos";

const NAV = [
  { key: "dashboard", label: "Dashboard", icon: "fa-gauge" },
  { key: "blog", label: "Blog Posts", icon: "fa-newspaper" },
  { key: "pastwork", label: "Past Work", icon: "fa-briefcase" },
  { key: "videos", label: "Videos", icon: "fa-circle-play" },
];

const AdminPanel = () => {
  const [authed, setAuthed] = useState(() => AdminStore.isAuthed());
  const [tab, setTab] = useState("dashboard");
  const [counts, setCounts] = useState({ posts: 0, projects: 0, videos: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);
  const hamburgerRef = useRef(null);

  const refreshCounts = useCallback(async () => {
    const [posts, projects, videos] = await Promise.all([
      AdminStore.getPosts(defaultPosts),
      AdminStore.getProjects(defaultProjects),
      AdminStore.getVideos(defaultVideos),
    ]);
    setCounts({
      posts: posts.length,
      projects: projects.length,
      videos: videos.length,
    });
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (authed) refreshCounts();
  }, [authed, refreshCounts]);

  // Lock body scroll while the mobile drawer is open
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  // Close on click outside the sidebar / hamburger
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleClick = (e) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(e.target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(e.target)
      ) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [sidebarOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKey = (e) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [sidebarOpen]);

  // Early return AFTER every hook has been declared above
  if (!authed) {
    return <AdminLogin onSuccess={() => setAuthed(true)} />;
  }

  const handleNavClick = (key) => {
    setTab(key);
    setSidebarOpen(false);
  };

  const handleLogout = () => {
    AdminStore.logout();
    setAuthed(false);
  };

  return (
    <div className="adm-wrap">
      <button
        ref={hamburgerRef}
        className={`adm-hamburger${sidebarOpen ? " open" : ""}`}
        onClick={() => setSidebarOpen((prev) => !prev)}
        aria-expanded={sidebarOpen}
        aria-controls="adm-sidebar"
        aria-label={sidebarOpen ? "Close menu" : "Open menu"}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {sidebarOpen && (
        <div
          className="adm-sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        id="adm-sidebar"
        ref={sidebarRef}
        className={`adm-sidebar${sidebarOpen ? " adm-sidebar-open" : ""}`}
      >
        <div className="adm-logo">
          <h2>St Manuel</h2>
          <p>Admin Panel</p>
        </div>
        <nav className="adm-nav">
          {NAV.map((item) => (
            <button
              key={item.key}
              className={`adm-nav-item${tab === item.key ? " active" : ""}`}
              onClick={() => handleNavClick(item.key)}
            >
              <i className={`fa-solid ${item.icon}`} aria-hidden="true" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="adm-sidebar-foot">
          <Link to="/" className="adm-view-site-link">
            ← View Site
          </Link>
          <LoadingButton className="adm-logout" onClick={handleLogout}>
            Sign Out
          </LoadingButton>
        </div>
      </aside>

      <main className="adm-main">
        {tab === "dashboard" && <AdminDashboard counts={counts} goTo={setTab} />}
        {tab === "blog" && (
          <AdminBlog onCountChange={(n) => setCounts((c) => ({ ...c, posts: n }))} />
        )}
        {tab === "pastwork" && (
          <AdminPastWork onCountChange={(n) => setCounts((c) => ({ ...c, projects: n }))} />
        )}
        {tab === "videos" && (
          <AdminVideos onCountChange={(n) => setCounts((c) => ({ ...c, videos: n }))} />
        )}
      </main>
    </div>
  );
};

export default AdminPanel;
