/* Full-screen branded loading screen. Shown briefly on every page/route
   change (see useRouteLoading in App.jsx) before the page content reveals. */
const PageLoader = ({ fadingOut }) => (
  <div
    className={`page-loader${fadingOut ? " is-fading" : ""}`}
    role="status"
    aria-live="polite"
    aria-label="Loading"
  >
    <div className="page-loader-mark">St Manuel</div>
    <div className="page-loader-ring" />
  </div>
);

export default PageLoader;
