import { useEffect } from "react";

function setMetaTag(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkTag(rel, href) {
  if (!href) return;
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

function removeMetaTag(attr, key) {
  const el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (el) el.remove();
}

/**
 * Keeps <title> and meta tags correct as the user navigates the SPA.
 * This is a UX/consistency nicety for in-app navigation and for Google
 * (which executes JS) — it is NOT what makes social link previews work.
 * That's handled separately, at build time, by prerendering each route to
 * static HTML with the same metadata already baked in.
 *
 * @param {object} meta - from seoConfig.js (buildMeta / getRouteMeta)
 * @param {object[]} [jsonLdList] - optional structured data objects
 */
export function useSeo(meta, jsonLdList = []) {
  useEffect(() => {
    if (!meta) return;

    document.title = meta.title;
    setMetaTag("name", "description", meta.description);
    setMetaTag("property", "og:title", meta.ogTitle);
    setMetaTag("property", "og:description", meta.ogDescription);
    setMetaTag("property", "og:image", meta.ogImage);
    setMetaTag("property", "og:url", meta.ogUrl);
    setMetaTag("property", "og:type", meta.ogType);
    setMetaTag("name", "twitter:card", meta.twitterCard);
    setMetaTag("name", "twitter:title", meta.ogTitle);
    setMetaTag("name", "twitter:description", meta.ogDescription);
    setMetaTag("name", "twitter:image", meta.ogImage);
    setLinkTag("canonical", meta.canonical);

    if (meta.robots) {
      setMetaTag("name", "robots", meta.robots);
    } else {
      removeMetaTag("name", "robots");
    }

    // Replace any JSON-LD this hook previously added, then add the current set.
    document.querySelectorAll('script[data-seo-jsonld="true"]').forEach((el) => el.remove());
    for (const jsonLd of jsonLdList) {
      if (!jsonLd) continue;
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.seoJsonld = "true";
      script.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(script);
    }
  }, [meta, jsonLdList]);
}
