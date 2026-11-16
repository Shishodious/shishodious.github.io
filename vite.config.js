import { copyFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// GitHub Pages has no SPA fallback: a deep link like /video is served the
// site's 404.html. Making that file a copy of index.html lets the router
// boot on any path.
const pagesFallback = () => {
  let outDir;
  return {
    name: 'pages-spa-fallback',
    apply: 'build',
    configResolved(config) {
      outDir = resolve(config.root, config.build.outDir);
    },
    closeBundle: () => copyFile(resolve(outDir, 'index.html'), resolve(outDir, '404.html')),
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), pagesFallback()],
  assetsInclude: ['**/*.glb'],
});
