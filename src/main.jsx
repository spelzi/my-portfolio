import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

/**
 * iOS Safari's dynamic toolbar means `100vh` / `100dvh` alone can't be
 * trusted to always match the true visible area — support varies across
 * Safari versions and the value doesn't always update live as the toolbar
 * shows/hides. Setting an actual pixel value via JS is the standard,
 * bulletproof fix. Used by .page-loader (see Style.css) instead of vh/dvh.
 */
function setAppHeight() {
  const height = window.visualViewport?.height ?? window.innerHeight;
  document.documentElement.style.setProperty("--app-height", `${height}px`);
}
setAppHeight();
window.addEventListener("resize", setAppHeight);
window.addEventListener("orientationchange", setAppHeight);
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", setAppHeight);
}

class ErrorBoundary extends React.Component {
  state = { error: null };
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error)
      return (
        <div
          style={{
            textAlign: "center",
            padding: "4rem",
            fontFamily: "sans-serif",
          }}
        >
          <h2>Something went wrong.</h2>
          <button onClick={() => (window.location.href = "/")}>Go Home</button>
        </div>
      );
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ErrorBoundary>
  </StrictMode>
);
