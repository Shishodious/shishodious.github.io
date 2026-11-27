import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { createServer, defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const escapeAttr = (value) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

// Sets one tag's attribute in the built index.html, however the tag is wrapped.
const setTag = (html, tag, key, attr, value) =>
  html.replace(
    new RegExp(`(<${tag}\\s+[^>]*?${key}[^>]*?\\s${attr}=")[^"]*(")`, 's'),
    (_, open, close) => `${open}${escapeAttr(value)}${close}`,
  );

const renderPage = (template, page, siteUrl) => {
  const canonical = `${siteUrl}${page.path}`;
  let html = template.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(page.title)}</title>`);
  html = setTag(html, 'meta', 'name="description"', 'content', page.description);
  html = setTag(html, 'link', 'rel="canonical"', 'href', canonical);
  html = setTag(html, 'meta', 'property="og:url"', 'content', canonical);
  html = setTag(html, 'meta', 'property="og:title"', 'content', page.title);
  html = setTag(html, 'meta', 'property="og:description"', 'content', page.description);
  html = setTag(html, 'meta', 'name="twitter:title"', 'content', page.title);
  html = setTag(html, 'meta', 'name="twitter:description"', 'content', page.description);
  const jsonLd = JSON.stringify(page.jsonLd).replace(/</g, '\\u003c');
  html = html.replace('</head>', `<script type="application/ld+json">${jsonLd}</script>\n  </head>`);
  return html.replace('<div id="root"></div>', `<div id="root"><div data-prerender>${page.html}</div></div>`);
};

// The app renders in the browser, so on its own every URL would serve the
// same empty shell: crawlers that don't run JS (most AI assistants, every
// social preview bot) would find no text, and GitHub Pages would answer
// deep links with a 404. After the build this writes a real file per route
// from src/seo/snapshot.js. "/video" becomes video.html, which Pages serves
// at /video with a 200; 404.html stays a plain copy of the shell, so any
// other path still boots the app. It also writes sitemap.xml from the same list.
const prerender = () => {
  let config;
  return {
    name: 'prerender-pages',
    apply: 'build',
    configResolved(resolved) {
      config = resolved;
    },
    async closeBundle() {
      const outDir = resolve(config.root, config.build.outDir);
      const template = await readFile(resolve(outDir, 'index.html'), 'utf8');
      await writeFile(resolve(outDir, '404.html'), template);

      const server = await createServer({
        root: config.root,
        mode: config.mode,
        configFile: false,
        logLevel: 'error',
        appType: 'custom',
        server: { middlewareMode: true, hmr: false },
        // Only loads a few data modules once: no dependency pre-bundling needed.
        optimizeDeps: { noDiscovery: true, entries: [] },
      });
      try {
        const { pages, SITE_URL } = await server.ssrLoadModule('/src/seo/snapshot.js');
        for (const page of pages) {
          const file = page.path === '/' ? 'index.html' : `${page.path.slice(1)}.html`;
          await writeFile(resolve(outDir, file), renderPage(template, page, SITE_URL));
        }
        // The sitemap lists exactly the pages just written, so a service
        // hidden with VITE_SHOW_* drops out of it too.
        const today = new Date().toISOString().slice(0, 10);
        const urls = pages
          .map((page) => `  <url>\n    <loc>${SITE_URL}${page.path}</loc>\n    <lastmod>${today}</lastmod>\n  </url>`)
          .join('\n');
        await writeFile(
          resolve(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        );
      } finally {
        await server.close();
      }
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), prerender()],
  assetsInclude: ['**/*.glb'],
});
