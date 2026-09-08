import fs from 'node:fs';
import path from 'node:path';
const origin = 'https://www.altumlapaz.com';
const args = process.argv.slice(2);
const keyFiles = fs.readdirSync('public').filter((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (keyFiles.length !== 1) throw Error('Expected exactly one public IndexNow verification file.');
const keyFile = keyFiles[0];
const key = fs.readFileSync(path.join('public', keyFile), 'utf8').trim();
if (keyFile !== `${key}.txt`) throw Error('Verification file does not match its content.');
const urls = args.includes('--sitemap')
  ? [...fs.readFileSync('dist/sitemap-0.xml', 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map(
      (m) => m[1],
    )
  : args;
if (!urls.length || urls.length > 10000)
  throw Error(
    'Pass changed public URLs, or --sitemap for the initial submission after deployment.',
  );
const urlList = [...new Set(urls)].map((value) => {
  const url = new URL(value);
  if (
    url.origin !== origin ||
    url.search ||
    url.hash ||
    /\/(demos|presentacion)\//.test(url.pathname)
  )
    throw Error('Only canonical indexable Altum URLs may be submitted.');
  return url.href;
});
const keyLocation = `${origin}/${keyFile}`;
const verification = await fetch(keyLocation, { signal: AbortSignal.timeout(15000) });
if (!verification.ok || (await verification.text()).trim() !== key)
  throw Error('Publish and verify the key on the live domain before notifying search engines.');
const response = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host: new URL(origin).host, key, keyLocation, urlList }),
  signal: AbortSignal.timeout(20000),
});
const meaning =
  response.status === 200
    ? 'Received by IndexNow; indexing and ranking are not guaranteed.'
    : response.status === 202
      ? 'Received; key validation pending. Indexing and ranking are not guaranteed.'
      : await response.text();
console.log(
  JSON.stringify({ status: response.status, submitted: urlList.length, meaning }, null, 2),
);
if (![200, 202].includes(response.status)) process.exitCode = 1;
