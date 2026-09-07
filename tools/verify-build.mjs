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
const presentation = fs.readFileSync(path.join(root, 'presentacion/index.html'), 'utf8');
const expectedQr = new Set(
  ['', 'menu/', 'agenda/', 'inventario/', 'commerce/', 'proyectos/', 'search/'].map(
    (route) => 'https://www.altumlapaz.com/demos/' + route,
  ),
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
  `Verified ${files.length} pages: titles, headings, metadata, paths, structured data and 7 decoded QR codes.`,
);
