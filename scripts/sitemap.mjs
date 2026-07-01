#!/usr/bin/env node
/**
 * scripts/sitemap.mjs
 *
 * Generates dist/sitemap.xml from the same getAllRoutes() list used by
 * the prerender script — they can never drift out of sync.
 *
 * Usage: node scripts/sitemap.mjs   (called automatically by `npm run build`)
 */

import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { getAllRoutes, SITE_URL } from "../src/seo/seoConfig.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST      = join(__dirname, "..", "dist");

function routeMeta(route) {
  if (route === "/")               return { priority: "1.0", changefreq: "weekly" };
  if (route === "/aboutme")        return { priority: "0.9", changefreq: "monthly" };
  if (route === "/pastwork")       return { priority: "0.8", changefreq: "monthly" };
  if (route === "/blog")           return { priority: "0.8", changefreq: "weekly" };
  if (route === "/blogvideo")      return { priority: "0.7", changefreq: "monthly" };
  if (route.startsWith("/blog/"))  return { priority: "0.7", changefreq: "monthly" };
  return                                  { priority: "0.5", changefreq: "yearly" };
}

const today  = new Date().toISOString().slice(0, 10);
const routes = getAllRoutes();

const urlTags = routes.map((route) => {
  const { priority, changefreq } = routeMeta(route);
  return `  <url>
    <loc>${SITE_URL}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>
`;

writeFileSync(join(DIST, "sitemap.xml"), xml);

// Also update Sitemap URL in robots.txt if it's there
const robotsPath = join(DIST, "robots.txt");
try {
  const existing = readFileSync(robotsPath, "utf-8");
  const updated  = existing.replace(/Sitemap:.*/,`Sitemap: ${SITE_URL}/sitemap.xml`);
  writeFileSync(robotsPath, updated);
} catch {
  // robots.txt may not exist yet — that's fine
}

console.log(`  ✓  sitemap.xml  (${routes.length} URLs → ${SITE_URL})`);
