#!/usr/bin/env node
/**
 * scripts/prerender.mjs
 *
 * Runs AFTER `vite build` + `vite build --ssr` (see package.json "build" script).
 *
 * For every public route it:
 *   1. Calls render(url) from the SSR bundle (dist-ssr/entry-server.js).
 *   2. Reads dist/index.html (the Vite-built template).
 *   3. Replaces <!--SEO_HEAD--> with per-route title/meta/OG/JSON-LD tags.
 *   4. Injects the rendered HTML into #root for crawlers that don't run JS.
 *   5. Writes dist/<route>/index.html  (or dist/index.html for "/").
 */

import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  getRouteMeta,
  renderHeadTags,
  getAllRoutes,
  personJsonLd,
  blogPostingJsonLd,
  breadcrumbJsonLd,
} from "../src/seo/seoConfig.js";

import { posts } from "../src/Component/postsData.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, "..");
const DIST      = join(ROOT, "dist");
const TEMPLATE  = readFileSync(join(DIST, "index.html"), "utf-8");

function getJsonLd(pathname) {
  if (pathname === "/" || pathname === "/aboutme") return [personJsonLd()];
  if (pathname === "/blog") return [personJsonLd()];
  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    const post = posts.find((p) => p.slug === slug);
    if (!post) return [];
    return [
      blogPostingJsonLd(post),
      breadcrumbJsonLd([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blog" },
        { name: post.title, path: `/blog/${post.slug}` },
      ]),
    ];
  }
  return [];
}

let renderFn;
try {
  const ssrEntry = await import(join(ROOT, "dist-ssr", "entry-server.js"));
  renderFn = ssrEntry.render;
  if (typeof renderFn !== "function") throw new Error("render is not a function");
} catch (err) {
  console.error("[prerender] Could not load dist-ssr/entry-server.js:", err.message);
  process.exit(1);
}

const routes = getAllRoutes();
let ok = 0;

for (const route of routes) {
  const meta    = getRouteMeta(route);
  const jsonLds = getJsonLd(route);
  const head    = renderHeadTags(meta, jsonLds);

  let appHtml = "";
  try {
    appHtml = renderFn(route);
  } catch (err) {
    console.warn(`  [warn] render failed for ${route}: ${err.message}`);
  }

  const html = TEMPLATE
    .replace("<!--SEO_HEAD-->", head)
    .replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);

  let outDir;
  if (route === "/") {
    outDir = DIST;
  } else {
    outDir = join(DIST, route.slice(1));
    mkdirSync(outDir, { recursive: true });
  }

  writeFileSync(join(outDir, "index.html"), html);
  console.log(`  ✓  ${route}`);
  ok++;
}

console.log(`\n  Prerendered ${ok} / ${routes.length} routes.\n`);
