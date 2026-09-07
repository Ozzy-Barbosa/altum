import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://www.altumlapaz.com',
  trailingSlash: 'always',
  integrations: [
    react(),
    sitemap({
      filter: (page) =>
        !page.includes('/demos/') && !page.includes('/presentacion/') && !page.includes('/404'),
    }),
  ],
  output: 'static',
  build: { format: 'directory' },
});
