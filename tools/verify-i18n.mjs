import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { visitCopy, normalize } from '../src/i18n/static-html.mjs';
import en from '../src/i18n/en.json' with { type: 'json' };
import { PNG } from 'pngjs';
import jsQR from 'jsqr';
const root = path.resolve('dist');
const files = fs.readdirSync(root, { recursive: true }).filter((file) => file.endsWith('.html') && !file.replaceAll('\\', '/').startsWith('en/'));
const missing = new Set();
for (const file of ['presentacion/index.html', 'tarjeta/index.html']) {
  const codes = (prefix) => [...fs.readFileSync(path.join(root, prefix, file), 'utf8').matchAll(/src="data:image\/png;base64,([^"]+)"/g)].map((match) => {
    const png = PNG.sync.read(Buffer.from(match[1], 'base64'));
    const code = jsQR(new Uint8ClampedArray(png.data), png.width, png.height);
    assert.ok(code, `${prefix}${file}: unreadable QR`);
    return code.data;
  });
  assert.deepEqual(codes('en'), codes('').map((url) => url.replace('https://www.altumlapaz.com/', 'https://www.altumlapaz.com/en/')), `${file}: English QR destinations`);
}
for (const file of files) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const english = path.join(root, 'en', file === '404.html' ? '404/index.html' : file);
  assert.ok(fs.existsSync(english), `Missing English route: ${file}`);
  visitCopy(html, (value) => {
    const key = normalize(value);
    if (key && !Object.hasOwn(en, key) && !['ES', 'EN', 'Idioma', 'Language'].includes(key)) missing.add(key);
    return value;
  });
  const translated = fs.readFileSync(english, 'utf8');
  assert.match(translated, /<html[^>]+lang="en"/, `${file}: English lang missing`);
  assert.match(translated, /rel="canonical" href="https:\/\/www.altumlapaz.com\/en\//, `${file}: canonical`);
  for (const locale of ['en', 'es-MX', 'x-default']) assert.ok(translated.includes(`hreflang="${locale}"`), `${file}: missing ${locale}`);
}
if (missing.size) { console.error('Unreviewed editorial copy:\n' + [...missing].sort().join('\n')); process.exitCode = 1; }
else console.log(`Verified ${files.length} Spanish/English route pairs and full editorial translation coverage.`);
