// This is a client-rendered SPA with no server/prerendering, so index.html's
// tags are the only ones a non-JS crawler (Facebook, Twitter/X, LinkedIn,
// Slack — none of them run JS) ever sees: every URL shares one title, one
// description and one preview image. That's a real limit, not a bug to hide;
// fixing it for real needs prerendering or SSR per route.
//
// What this *can* do is keep the document correct for everyone who does run
// JS — visitors, and Googlebot's render pass — by updating the title, the
// meta description, the canonical link and the Open Graph/Twitter tags to
// match whichever route is on screen right now.

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
  const fullTitle = title ? `${title} — Priyanshu Shishodia` : "Priyanshu Shishodia — Studio";
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
