/**
 * entry-server.jsx
 *
 * Exports a single `render(url)` function used by scripts/prerender.mjs.
 * Built with: vite build --ssr src/entry-server.jsx --outDir dist-ssr
 *
 * Must NOT be imported by any client-side module — only by the prerender script.
 */

import { renderToString } from "react-dom/server";
import { StaticRouter, Routes, Route } from "react-router-dom";
import React from "react";

import Home      from "./Component/Home.jsx";
import AboutMe   from "./Component/AboutMe.jsx";
import Blog      from "./Component/Blog.jsx";
import BlogPost  from "./Component/BlogPost.jsx";
import BlogVideo from "./Component/BlogVideo.jsx";
import PastWork  from "./Component/PastWork.jsx";

import "./Component/Styling/AboutMe.css";
import "./Component/Styling/Blog.css";
import "./Component/Styling/BlogPost.css";
import "./Component/Styling/BlogVideo.css";
import "./Component/Styling/PastWork.css";
import "./Component/Styling/Style.css";
import "./App.css";

function ServerApp({ url }) {
  return (
    <StaticRouter location={url}>
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/aboutme"    element={<AboutMe />} />
        <Route path="/blog"       element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/blogvideo"  element={<BlogVideo />} />
        <Route path="/pastwork"   element={<PastWork />} />
      </Routes>
    </StaticRouter>
  );
}

export function render(url) {
  return renderToString(<ServerApp url={url} />);
}
