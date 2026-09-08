import fs from 'node:fs';
import path from 'node:path';
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
const root = path.resolve('dist');
// Preserve the sitemap URL used by the previous landing and submitted properties.
fs.copyFileSync(path.join(root, 'sitemap-index.xml'), path.join(root, 'sitemap.xml'));
const files = fs.readdirSync(root, { recursive: true }).filter((p) => p.endsWith('.html'));
const errors = [];
const titles = new Set();
for (const relative of files) {
  const file = path.join(root, relative);
  const html = fs.readFileSync(file, 'utf8');
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
  if (!title) errors.push(`${relative}: missing title`);
  if (titles.has(title)) errors.push(`${relative}: duplicate title`);
  titles.add(title);
  if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${relative}: expected one h1`);
  if (!/<meta\s+name="description"\s+content="[^"]+"/.test(html))
    errors.push(`${relative}: missing description`);
  if (!/<link\s+rel="canonical"\s+href="https:\/\/www\.altumlapaz\.com\//.test(html))
    errors.push(`${relative}: invalid canonical`);
  for (const m of html.matchAll(/(?:href|src)="([^"#]+)(?:#[^"]*)?"/g)) {
    let url = m[1].replaceAll('&amp;', '&').split('?')[0];
    if (!url.startsWith('/') || url.startsWith('//')) continue;
    const destination = path.join(root, decodeURIComponent(url));
    if (!fs.existsSync(destination) && !fs.existsSync(path.join(destination, 'index.html')))
      errors.push(`${relative}: missing ${url}`);
  }
  for (const m of html.matchAll(
    /<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g,
  )) {
    try {
      JSON.parse(m[1]);
    } catch {
      errors.push(`${relative}: invalid structured data`);
    }
  }
  if (relative.startsWith('demos') && !html.includes('noindex, follow'))
    errors.push(`${relative}: demo must be noindex`);
}
for (const file of ['CNAME', 'robots.txt', 'sitemap-index.xml', '404.html'])
  if (!fs.existsSync(path.join(root, file))) errors.push(`Missing ${file}`);
const sitemap = fs.readFileSync(path.join(root, 'sitemap-0.xml'), 'utf8');
const indexable = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (new Set(indexable).size !== indexable.length) errors.push('Duplicate sitemap entries');
if (indexable.some((url) => /\/(demos|presentacion)\//.test(url)))
  errors.push('Demo or presentation in sitemap');
for (const url of indexable) {
  const route = new URL(url).pathname;
  const htmlPath = path.join(root, route, 'index.html');
  if (!fs.existsSync(htmlPath)) {
    errors.push('Sitemap route missing: ' + route);
    continue;
  }
  if (fs.readFileSync(htmlPath, 'utf8').includes('noindex, follow'))
    errors.push('Noindex route in sitemap: ' + route);
}
const feed = fs.readFileSync(path.join(root, 'soluciones/rss.xml'), 'utf8');
for (const m of feed.matchAll(/<guid isPermaLink="true">([^<]+)<\/guid>/g)) {
  if (!indexable.includes(m[1])) errors.push('RSS article absent from sitemap: ' + m[1]);
  const article = fs.readFileSync(path.join(root, new URL(m[1]).pathname, 'index.html'), 'utf8');
  if (!article.includes('BlogPosting') || !article.includes('article:published_time'))
    errors.push('Article metadata missing: ' + m[1]);
}
const presentation = fs.readFileSync(path.join(root, 'presentacion/index.html'), 'utf8');
const expectedQr = new Set(
  [
    '',
    ...fs
      .readdirSync(path.join(root, 'demos'), { withFileTypes: true })
      .filter((e) => e.isDirectory())
      .map((e) => e.name + '/'),
  ].map((route) => 'https://www.altumlapaz.com/demos/' + route),
);
for (const match of presentation.matchAll(/src="data:image\/png;base64,([^"]+)"/g)) {
  const png = PNG.sync.read(Buffer.from(match[1], 'base64'));
  const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
  if (!code || !expectedQr.delete(code.data))
    errors.push('Unreadable or unexpected presentation QR');
}
if (expectedQr.size) errors.push('Missing presentation QR codes: ' + [...expectedQr].join(', '));
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  `Verified ${files.length} pages: titles, headings, metadata, paths, structured data and ${[...presentation.matchAll(/src="data:image\/png;base64,/g)].length} decoded QR codes.`,
);
