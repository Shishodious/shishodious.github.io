// Every route is pre-rendered at build time (src/seo/snapshot.js) with its own
// title, description, canonical, Open Graph tags and page text, so crawlers
// that never run JS still get the right page. This keeps those same tags in
// step once the app is running and the visitor moves between routes.

import { home } from "./catalog";

export const SITE_URL = "https://shishodious.github.io";

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector);
  if (el) el.setAttribute(attr, value);
};

/**
 * Point the document at one page: `title` is the bare page name (no site
 * suffix — this adds it), `description` is a one-to-two sentence summary,
 * and `path` is the route ("/", "/video", ...).
 */
export const setPageMeta = ({ title, description, path }) => {
  const fullTitle = title ? `${title} — Priyanshu Shishodia` : home.title;
  const url = `${SITE_URL}${path === "/" ? "/" : path}`;

  document.title = fullTitle;
  setMeta('meta[name="description"]', "content", description);
  setMeta('link[rel="canonical"]', "href", url);
  setMeta('meta[property="og:title"]', "content", fullTitle);
  setMeta('meta[property="og:description"]', "content", description);
  setMeta('meta[property="og:url"]', "content", url);
  setMeta('meta[name="twitter:title"]', "content", fullTitle);
  setMeta('meta[name="twitter:description"]', "content", description);
};
