// Single source of truth for SEO metadata.
//
// Used by BOTH:
//  - the client-side useSeo() hook (keeps <title>/meta tags correct as the
//    user navigates the SPA after the initial load)
//  - the build-time prerender script (bakes correct tags into the static
//    HTML for every route, so crawlers and link-unfurling bots that don't
//    execute JS still get the right title/description/image per page)
//
// Set VITE_SITE_URL in your .env before deploying — see .env.example.
// Falls back to a placeholder so local dev/builds don't crash without it.

import { posts } from "../Component/postsData.js";

// import.meta.env is a Vite-only construct — it's undefined when this file
// is imported by bare Node (prerender script, sitemap generator).
// We fall back to process.env so both contexts work.
const _env =
  (typeof import.meta !== "undefined" && import.meta.env) ||
  (typeof globalThis.process !== "undefined" ? globalThis.process.env : {});

export const SITE_URL = (_env.VITE_SITE_URL || "https://your-domain.com").replace(/\/$/, "");

export const SITE_NAME = "St Manuel";
export const AUTHOR_NAME = "Emmanuel Chidiebube Uzor";
export const TITLE_SUFFIX = "Emmanuel Uzor";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;
export const TWITTER_SITE = "@st_manuel1";

export const SOCIAL_LINKS = [
  "https://github.com/spelzi",
  "https://www.linkedin.com/in/emmanuel-chidiebube-uzor",
  "https://x.com/st_manuel1",
  "https://t.me/stmempire",
];

/**
 * Builds a complete, consistent metadata object for one page.
 * @param {object} opts
 * @param {string} opts.title - Page title WITHOUT the site suffix (e.g. "About"). Pass "" for the homepage.
 * @param {string} opts.description - 1–2 sentence summary, ideally 120–160 chars.
 * @param {string} opts.path - Route path starting with "/", e.g. "/aboutme".
 * @param {string} [opts.image] - Absolute image URL for social previews. Defaults to the site OG image.
 * @param {"website"|"article"|"profile"} [opts.type] - Open Graph type.
 */
export function buildMeta({ title, description, path, image, type = "website", noindex = false }) {
  const url = `${SITE_URL}${path}`;
  const fullTitle = title ? `${title} | ${TITLE_SUFFIX}` : `${AUTHOR_NAME} | ${SITE_NAME}`;
  return {
    title: fullTitle,
    description,
    canonical: url,
    ogTitle: fullTitle,
    ogDescription: description,
    ogImage: image || DEFAULT_OG_IMAGE,
    ogType: type,
    ogUrl: url,
    twitterCard: "summary_large_image",
    robots: noindex ? "noindex, nofollow" : null,
  };
}

/** Metadata for every static (non-dynamic-slug) public route. */
export function getStaticRouteMeta(pathname) {
  switch (pathname) {
    case "/":
      return buildMeta({
        title: "",
        description:
          "Portfolio of Emmanuel Chidiebube Uzor (St Manuel) — full stack web developer, crypto & forex trader, and business consultant based in Lagos, Nigeria.",
        path: "/",
        type: "profile",
      });
    case "/aboutme":
      return buildMeta({
        title: "About",
        description:
          "Full stack web developer, crypto/forex trader, and business consultant. Skills, experience, education, and certifications for Emmanuel Chidiebube Uzor.",
        path: "/aboutme",
        type: "profile",
      });
    case "/blog":
      return buildMeta({
        title: "Blog",
        description:
          "Writing on Smart Money Concepts, full stack development with React and Supabase, and digital strategy for entrepreneurs.",
        path: "/blog",
      });
    case "/pastwork":
      return buildMeta({
        title: "Past Work",
        description:
          "A selection of full stack web development projects, including STM Styling, this portfolio, and a trading dashboard.",
        path: "/pastwork",
      });
    case "/blogvideo":
      return buildMeta({
        title: "Videos",
        description:
          "Video breakdowns on Smart Money Concepts, React development, and forex trading.",
        path: "/blogvideo",
      });
    default:
      return null;
  }
}

export function notFoundMeta(path) {
  return buildMeta({
    title: "Page Not Found",
    description: "The page you're looking for doesn't exist.",
    path,
    noindex: true,
  });
}

/** Metadata for a single blog post page. */
export function getBlogPostMeta(post) {
  if (!post) return null;
  return buildMeta({
    title: post.title,
    description: post.excerpt,
    path: `/blog/${post.slug}`,
    type: "article",
  });
}

/**
 * Every public route that should be prerendered + included in the sitemap.
 * Blog posts come from the default seed data (postsData.js) — content
 * added later purely through the admin panel lives in a visitor's
 * localStorage only, so it was never visible to other users or crawlers
 * in the first place; this just reflects that existing reality.
 */
export function getAllRoutes() {
  const staticRoutes = ["/", "/aboutme", "/blog", "/pastwork", "/blogvideo"];
  const blogRoutes = posts.map((p) => `/blog/${p.slug}`);
  return [...staticRoutes, ...blogRoutes];
}

export function getRouteMeta(pathname) {
  const staticMeta = getStaticRouteMeta(pathname);
  if (staticMeta) return staticMeta;

  if (pathname.startsWith("/blog/")) {
    const slug = pathname.slice("/blog/".length);
    const post = posts.find((p) => p.slug === slug);
    return post ? getBlogPostMeta(post) : null;
  }

  return null;
}

/* ───────────────────────── Structured data (JSON-LD) ───────────────────────── */

export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: AUTHOR_NAME,
    alternateName: SITE_NAME,
    url: SITE_URL,
    jobTitle: ["Full Stack Web Developer", "Crypto & Forex Trader", "Business Consultant"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ikeja, Lagos",
      addressCountry: "NG",
    },
    sameAs: SOCIAL_LINKS,
  };
}

export function blogPostingJsonLd(post) {
  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    url,
    mainEntityOfPage: url,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: AUTHOR_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Person",
      name: AUTHOR_NAME,
    },
  };
}

export function breadcrumbJsonLd(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

/* ───────────────────────── Static HTML head injection ───────────────────────── */
// Used only by the build-time prerender script — generates the raw <head>
// tag string baked into each route's static HTML file.

function escapeHtml(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderHeadTags(meta, jsonLdList = []) {
  if (!meta) return "";
  const tags = [
    `<title>${escapeHtml(meta.title)}</title>`,
    `<meta name="description" content="${escapeHtml(meta.description)}" />`,
    `<link rel="canonical" href="${escapeHtml(meta.canonical)}" />`,
    `<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`,
    `<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`,
    `<meta property="og:image" content="${escapeHtml(meta.ogImage)}" />`,
    `<meta property="og:url" content="${escapeHtml(meta.ogUrl)}" />`,
    `<meta property="og:type" content="${escapeHtml(meta.ogType)}" />`,
    `<meta property="og:site_name" content="${escapeHtml(SITE_NAME)}" />`,
    `<meta name="twitter:card" content="${escapeHtml(meta.twitterCard)}" />`,
    `<meta name="twitter:site" content="${escapeHtml(TWITTER_SITE)}" />`,
    `<meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(meta.ogImage)}" />`,
  ];
  if (meta.robots) {
    tags.push(`<meta name="robots" content="${escapeHtml(meta.robots)}" />`);
  }
  for (const jsonLd of jsonLdList) {
    if (!jsonLd) continue;
    // JSON.stringify output is safe inside a <script> tag except for the
    // "</script" sequence, which would terminate the tag early if present
    // in any string field — escape it defensively.
    const json = JSON.stringify(jsonLd).replace(/<\/script/gi, "<\\/script");
    tags.push(`<script type="application/ld+json">${json}</script>`);
  }
  return tags.join("\n    ");
}
