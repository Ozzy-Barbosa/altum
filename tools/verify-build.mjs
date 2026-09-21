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
const siteOrigin = 'https://www.altumlapaz.com';
const defaultSocialImagePath = '/assets/altum-social-20260921.jpg';
const defaultSocialImageUrl = siteOrigin + defaultSocialImagePath;
// Inspect JPEG frame dimensions without adding an image-processing dependency to CI.
function jpegDimensions(buffer) {
  if (buffer.length < 4 || buffer.readUInt16BE(0) !== 0xffd8) return null;
  let offset = 2;
  while (offset + 4 < buffer.length && buffer[offset] === 0xff) {
    while (buffer[offset] === 0xff) offset++;
    if (offset + 3 > buffer.length) return null;
    const marker = buffer[offset++];
    if (marker === 0xda || marker === 0xd9) break;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = buffer.readUInt16BE(offset);
    if (length < 2 || offset + length > buffer.length) return null;
    if (
      [0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(
        marker,
      )
    ) {
      if (length < 8) return null;
      return { width: buffer.readUInt16BE(offset + 5), height: buffer.readUInt16BE(offset + 3) };
    }
    offset += length;
  }
  return null;
}
const defaultSocialImageFile = path.join(root, defaultSocialImagePath);
if (!fs.existsSync(defaultSocialImageFile)) {
  errors.push(`Missing social preview image: ${defaultSocialImagePath}`);
} else {
  const dimensions = jpegDimensions(fs.readFileSync(defaultSocialImageFile));
  if (dimensions?.width !== 1200 || dimensions?.height !== 630)
    errors.push('Default social preview must be a JPEG measuring 1200 × 630 pixels');
}
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
  const metadata = new Map(
    [...html.matchAll(/<meta\b[^>]*>/g)].map(([tag]) => [
      tag.match(/\b(?:property|name)="([^"]+)"/)?.[1],
      tag.match(/\bcontent="([^"]*)"/)?.[1]?.replaceAll('&amp;', '&'),
    ]),
  );
  for (const name of [
    'og:title',
    'og:description',
    'og:type',
    'og:url',
    'og:image',
    'og:image:secure_url',
    'og:image:alt',
    'twitter:card',
    'twitter:title',
    'twitter:description',
    'twitter:image',
    'twitter:image:alt',
  ]) {
    if (!metadata.get(name)?.trim()) errors.push(`${relative}: missing social metadata ${name}`);
  }
  const canonical = html.match(/<link\b[^>]*rel="canonical"[^>]*href="([^"]+)"/)?.[1];
  if (metadata.get('og:url') !== canonical)
    errors.push(`${relative}: Open Graph URL differs from canonical`);
  for (const [og, twitter] of [
    ['og:title', 'twitter:title'],
    ['og:description', 'twitter:description'],
    ['og:image', 'twitter:image'],
    ['og:image:alt', 'twitter:image:alt'],
  ]) {
    if (metadata.get(og) !== metadata.get(twitter))
      errors.push(`${relative}: inconsistent ${og} and ${twitter}`);
  }
  const imageUrl = metadata.get('og:image');
  try {
    const url = new URL(imageUrl);
    if (url.protocol !== 'https:') errors.push(`${relative}: social image must use absolute HTTPS`);
    if (
      url.origin === siteOrigin &&
      !fs.existsSync(path.join(root, decodeURIComponent(url.pathname)))
    )
      errors.push(`${relative}: missing social image ${url.pathname}`);
  } catch {
    errors.push(`${relative}: invalid absolute social image URL`);
  }
  if (metadata.get('og:image:secure_url') !== imageUrl)
    errors.push(`${relative}: inconsistent secure social image URL`);
  if (metadata.get('twitter:card') !== 'summary_large_image')
    errors.push(`${relative}: expected a large-image social card`);
  if (imageUrl === defaultSocialImageUrl) {
    if (
      metadata.get('og:image:type') !== 'image/jpeg' ||
      metadata.get('og:image:width') !== '1200' ||
      metadata.get('og:image:height') !== '630'
    )
      errors.push(`${relative}: incorrect default social image type or dimensions`);
  } else if (
    metadata.has('og:image:width') ||
    metadata.has('og:image:height') ||
    metadata.has('og:image:type')
  ) {
    errors.push(`${relative}: custom image must not inherit the default banner dimensions or type`);
  }
  if (
    relative === 'index.html' &&
    (imageUrl !== defaultSocialImageUrl ||
      metadata.get('og:title') !== 'Altum La Paz | Diseño web y aplicaciones')
  )
    errors.push('Homepage must use the current branded social image and short sharing title');
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
      const data = JSON.parse(m[1]);
      const business = data['@graph']?.find((item) => item['@type'] === 'ProfessionalService');
      if (business && business.image !== defaultSocialImageUrl)
        errors.push(`${relative}: business schema must use the current social banner`);
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
  `Verified ${files.length} pages: titles, headings, metadata, social previews, paths, structured data and ${[...presentation.matchAll(/src="data:image\/png;base64,/g)].length} decoded QR codes.`,
);
