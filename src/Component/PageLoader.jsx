import { useEffect, useState } from "react";

function useVisibleHeight() {
  const [height, setHeight] = useState(() =>
    typeof window === "undefined" ? 0 : window.visualViewport?.height || window.innerHeight
  );

  useEffect(() => {
    const vv = window.visualViewport;
    const update = () => setHeight(vv?.height || window.innerHeight);

    update();
    vv?.addEventListener("resize", update);
    vv?.addEventListener("scroll", update);
    window.addEventListener("resize", update);

    return () => {
      vv?.removeEventListener("resize", update);
      vv?.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return height;
}

/* Full-screen branded loading screen. Shown briefly on every page/route
   change (see useRouteLoading in App.jsx) before the page content reveals. */
const PageLoader = ({ fadingOut }) => {
  const visibleHeight = useVisibleHeight();

  return (
    <div
      className={`page-loader${fadingOut ? " is-fading" : ""}`}
      role="status"
      aria-live="polite"
      aria-label="Loading"
      style={visibleHeight ? { height: visibleHeight } : undefined}
    >
      <div className="page-loader-mark">St Manuel</div>
      <div className="page-loader-ring" />
    </div>
  );
};

export default PageLoader;
