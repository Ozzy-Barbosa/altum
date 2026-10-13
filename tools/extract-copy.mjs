import fs from 'node:fs';
import path from 'node:path';
import { visitCopy, normalize } from '../src/i18n/static-html.mjs';
const entries = new Set();
function walk(dir) {
  for (const file of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['en', '_astro', 'assets'].includes(file.name)) continue;
    const location = path.join(dir, file.name);
    if (file.isDirectory()) walk(location);
    else if (file.name.endsWith('.html')) visitCopy(fs.readFileSync(location, 'utf8'), (value) => { entries.add(normalize(value)); return value; });
  }
}
walk('dist');
const list = [...entries].filter(Boolean).sort();
if (process.argv.includes('--snapshot')) fs.writeFileSync('src/i18n/es.json', JSON.stringify(list, null, 2) + '\n');
const start = Number(process.argv[2]) || 0;
const count = Number(process.argv[3]) || list.length;
console.log(list.slice(start, start + count).map((v, i) => `${start + i}: ${v}`).join('\n'));
