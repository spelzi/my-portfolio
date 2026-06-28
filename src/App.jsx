import { useEffect, useRef, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import AboutMe from "./Component/AboutMe";
import AdminPanel from "./Component/Admin/AdminPanel";
import Blog from "./Component/Blog";
import BlogPost from "./Component/BlogPost";
import BlogVideo from "./Component/BlogVideo";
import Home from "./Component/Home";
import MainNav from "./Component/MainNav";
import PageLoader from "./Component/PageLoader";
import PastWork from "./Component/PastWork";
// ---------------------------- App Styling import ------------------------------------------------
import "./Component/Styling/AboutMe.css";
import "./Component/Styling/AdminStyle.css";
import "./Component/Styling/Blog.css";
import "./Component/Styling/BlogPost.css";
import "./Component/Styling/BlogVideo.css";
import "./Component/Styling/PastWork.css";
import "./Component/Styling/Style.css";

/* Public site layout — nav + footer wrap every public-facing page */
const SiteLayout = ({ children }) => (
  <>
    <header>
      <MainNav />
    </header>
    <main>{children}</main>
    <footer className="site-footer" id="top">
      <div className="to-up">
        <a href="#top">↑ Back to top</a>
      </div>
      <p>© {new Date().getFullYear()} St Manuel · Lagos, Nigeria</p>
    </footer>
  </>
);

const FADE_MS = 300;

function useRouteLoading(pathname) {
  const [loading, setLoading] = useState(true);
  const [fadingOut, setFadingOut] = useState(false);
  const isFirstMount = useRef(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFadingOut(false);

    setLoading(true);

    const delay = isFirstMount.current ? 650 : 450;
    const fadeTimer = setTimeout(() => setFadingOut(true), delay);
    const hideTimer = setTimeout(() => {
      setLoading(false);
      isFirstMount.current = false;
    }, delay + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
    // FIX 2: removed stale exhaustive-deps disable comment — rule passes
    // cleanly now that react-hooks plugin is properly configured
  }, [pathname]);

  return { loading, fadingOut };
}

function App() {
  const location = useLocation();
  const { loading, fadingOut } = useRouteLoading(location.pathname);

  return (
    <>
      {loading && <PageLoader fadingOut={fadingOut} />}
      <Routes>
        {/* Admin panel — standalone shell, no public nav/footer */}
        <Route path="/admin" element={<AdminPanel />} />
        {/* Public site — all routes share the nav + footer layout */}
        <Route
          path="/"
          element={
            <SiteLayout>
              <Home />
            </SiteLayout>
          }
        />
        <Route
          path="/aboutme"
          element={
            <SiteLayout>
              <AboutMe />
            </SiteLayout>
          }
        />
        <Route
          path="/blog"
          element={
            <SiteLayout>
              <Blog />
            </SiteLayout>
          }
        />
        <Route
          path="/blog/:slug"
          element={
            <SiteLayout>
              <BlogPost />
            </SiteLayout>
          }
        />
        <Route
          path="/pastwork"
          element={
            <SiteLayout>
              <PastWork />
            </SiteLayout>
          }
        />
        <Route
          path="/blogvideo"
          element={
            <SiteLayout>
              <BlogVideo />
            </SiteLayout>
          }
        />
      </Routes>
    </>
  );
}

export default App;
